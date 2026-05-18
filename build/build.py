import markdown
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent

INPUT_DIR = SCRIPT_DIR.parent / "posts"
OUTPUT_DIR = SCRIPT_DIR.parent / "html" / "blog"
TEMPLATE_PATH = SCRIPT_DIR / "template.html"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


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
