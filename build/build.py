import json
import re
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


class FrontMatterError(ValueError):
    pass


def truncate_description(text, limit):
    normalized = " ".join(text.split())
    if len(normalized) <= limit:
        return normalized

    return normalized[: limit - 3].rstrip() + "..."


def parse_front_matter(md_content, file_name):
    if not md_content.startswith("---\n"):
        raise FrontMatterError(f"{file_name} is missing YAML front matter.")

    parts = md_content.split("---\n", 2)
    if len(parts) < 3:
        raise FrontMatterError(f"{file_name} has malformed YAML front matter.")

    raw_front_matter = parts[1]
    body = parts[2].lstrip()
    metadata = {}

    for line in raw_front_matter.splitlines():
        stripped = line.strip()
        if not stripped:
            continue

        if ":" not in stripped:
            raise FrontMatterError(
                f"{file_name} has an invalid front matter line: {line!r}"
            )

        key, value = stripped.split(":", 1)
        metadata[key.strip()] = value.strip()

    title = metadata.get("title")
    date = metadata.get("date")

    if not title:
        raise FrontMatterError(f"{file_name} is missing a title in front matter.")

    if not date:
        raise FrontMatterError(f"{file_name} is missing a date in front matter.")

    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", date):
        raise FrontMatterError(
            f"{file_name} has an invalid date {date!r}. Expected YYYY-MM-DD."
        )

    return metadata, body


def extract_first_paragraph(html_content):
    parser = BlogHTMLParser()
    parser.feed(html_content)
    return truncate_description(parser.first_paragraph, DESCRIPTION_CHAR_LIMIT)


def generate_blog_data(posts):
    posts.sort(key=lambda post: post["date"], reverse=True)
    js_content = "window.generatedPosts = " + json.dumps(posts, indent=2) + ";\n"
    BLOG_DATA_PATH.write_text(js_content, encoding="utf-8")
    print(f"Generated: {BLOG_DATA_PATH.relative_to(SCRIPT_DIR.parent)}")


def convert_md_to_html():
    if not INPUT_DIR.exists():
        print(f"Error: Input directory '{INPUT_DIR}' not found.")
        return []

    posts = []

    for md_file in INPUT_DIR.glob("*.md"):
        md_content = md_file.read_text(encoding="utf-8")
        metadata, body = parse_front_matter(md_content, md_file.name)

        html_content = markdown.markdown(body)
        html_filename = md_file.stem + ".html"
        output_path = OUTPUT_DIR / html_filename
        template_html = TEMPLATE_PATH.read_text(encoding="utf-8")
        full_html = template_html.format(title=metadata["title"], content=html_content)

        output_path.write_text(full_html, encoding="utf-8")

        posts.append(
            {
                "title": metadata["title"],
                "date": metadata["date"],
                "description": extract_first_paragraph(html_content),
                "url": f"blog/{html_filename}",
            }
        )

        print(f"Converted: {md_file.name} -> {html_filename}")

    return posts


if __name__ == "__main__":
    posts = convert_md_to_html()
    generate_blog_data(posts)
