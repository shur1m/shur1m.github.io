import json

from settings import BLOG_DATA_PATH, INPUT_DIR, OUTPUT_DIR
from post_loader import load_post
from post_models import Post


def build_site() -> None:
    if not INPUT_DIR.exists():
        raise FileNotFoundError(f"Input directory '{INPUT_DIR}' not found.")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    posts: list[Post] = []
    for source_path in sorted(INPUT_DIR.glob("*.md")):
        post, output_name, full_html = load_post(source_path)
        (OUTPUT_DIR / output_name).write_text(full_html, encoding="utf-8")
        posts.append(post)
        print(f"Converted: {source_path.name} -> {output_name}")

    write_post_metadata(posts)


def write_post_metadata(posts: list[Post]) -> None:
    sorted_posts = sorted(posts, key=lambda post: post.created_on, reverse=True)
    metadata = [post.as_metadata() for post in sorted_posts]
    js_content = "window.generatedPosts = " + json.dumps(metadata, indent=2) + ";\n"
    BLOG_DATA_PATH.write_text(js_content, encoding="utf-8")
    print(f"Generated: {BLOG_DATA_PATH.relative_to(INPUT_DIR.parent)}")
