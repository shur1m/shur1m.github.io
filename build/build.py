import json
import markdown
from html.parser import HTMLParser
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent

INPUT_DIR = SCRIPT_DIR.parent / "markdown"
OUTPUT_DIR = SCRIPT_DIR.parent / "blog"
TEMPLATE_PATH = SCRIPT_DIR / "template.html"
BLOG_DATA_PATH = SCRIPT_DIR.parent / "js" / "post-metadata.js"
DESCRIPTION_CHAR_LIMIT = 200
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


class BlogHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self._in_title = False
        self._in_paragraph = False
        self._title_chunks = []
        self._paragraph_chunks = []
        self.title = ""
        self.first_paragraph = ""

    def handle_starttag(self, tag, attrs):
        if tag == "title":
            self._in_title = True
        elif tag == "p" and not self.first_paragraph:
            self._in_paragraph = True

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
            self.title = "".join(self._title_chunks).strip()
        elif tag == "p" and self._in_paragraph:
            self._in_paragraph = False
            self.first_paragraph = "".join(self._paragraph_chunks).strip()

    def handle_data(self, data):
        if self._in_title:
            self._title_chunks.append(data)
        elif self._in_paragraph:
            self._paragraph_chunks.append(data)


def truncate_description(text, limit):
    normalized = " ".join(text.split())
    if len(normalized) <= limit:
        return normalized

    return normalized[: limit - 3].rstrip() + "..."


def extract_blog_metadata(html_path):
    parser = BlogHTMLParser()
    parser.feed(html_path.read_text(encoding="utf-8"))

    return {
        "title": parser.title or html_path.stem,
        "description": truncate_description(
            parser.first_paragraph, DESCRIPTION_CHAR_LIMIT
        ),
        "url": f"blog/{html_path.name}",
    }


def generate_blog_data():
    posts = [
        extract_blog_metadata(html_path)
        for html_path in sorted(OUTPUT_DIR.glob("*.html"))
    ]
    js_content = "window.generatedPosts = " + json.dumps(posts, indent=2) + ";\n"
    BLOG_DATA_PATH.write_text(js_content, encoding="utf-8")
    print(f"Generated: {BLOG_DATA_PATH.relative_to(SCRIPT_DIR.parent)}")


def convert_md_to_html():
    if not INPUT_DIR.exists():
        print(f"Error: Input directory '{INPUT_DIR}' not found.")
        return

    for md_file in INPUT_DIR.glob("*.md"):
        with open(md_file, "r", encoding="utf-8") as f:
            md_content = f.read()

        html_content = markdown.markdown(md_content)
        html_filename = md_file.stem + ".html"
        output_path = OUTPUT_DIR / html_filename
        template_html = TEMPLATE_PATH.read_text(encoding="utf-8")
        full_html = template_html.format(title=md_file.stem, content=html_content)

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(full_html)

        print(f"Converted: {md_file.name} -> {html_filename}")


if __name__ == "__main__":
    convert_md_to_html()
    generate_blog_data()
