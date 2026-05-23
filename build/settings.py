from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent

INPUT_DIR = PROJECT_ROOT / "markdown"
OUTPUT_DIR = PROJECT_ROOT / "blog"
TEMPLATE_PATH = SCRIPT_DIR / "template.html"
BLOG_DATA_PATH = PROJECT_ROOT / "js" / "post-metadata.js"
DESCRIPTION_CHAR_LIMIT = 180
