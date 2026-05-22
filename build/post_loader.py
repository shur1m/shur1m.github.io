import markdown
import frontmatter

from datetime import date
from pathlib import Path

from html_utils import extract_first_paragraph, truncate_description
from post_models import Post
from settings import DESCRIPTION_CHAR_LIMIT, TEMPLATE_PATH


class PostValidationError(ValueError):
    pass


def load_post(source_path: Path) -> tuple[Post, str, str]:
    document = frontmatter.load(source_path)
    title = _require_string_field(document.metadata, "title", source_path)
    created_on = _require_iso_date(document.metadata, "date", source_path)

    html_content = markdown.markdown(document.content)
    output_name = f"{source_path.stem}.html"
    description = truncate_description(
        extract_first_paragraph(html_content), DESCRIPTION_CHAR_LIMIT
    )

    post = Post(
        title=title,
        created_on=created_on,
        description=description,
        url=f"blog/{output_name}",
    )
    full_html = render_post_html(title=title, content=html_content)
    return post, output_name, full_html


def render_post_html(*, title: str, content: str) -> str:
    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    return template.format(title=title, content=content)


def _require_string_field(metadata: dict, field_name: str, source_path: Path) -> str:
    value = metadata.get(field_name)
    if not isinstance(value, str) or not value.strip():
        raise PostValidationError(
            f"{source_path.name} is missing a valid {field_name!r} field."
        )

    return value.strip()


def _require_iso_date(metadata: dict, field_name: str, source_path: Path) -> date:
    value = metadata.get(field_name)

    if isinstance(value, date):
        return value

    if not isinstance(value, str):
        raise PostValidationError(
            f"{source_path.name} is missing a valid {field_name!r} field."
        )

    try:
        return date.fromisoformat(value)
    except ValueError as exc:
        raise PostValidationError(
            f"{source_path.name} has an invalid {field_name!r} value {value!r}. "
            "Expected YYYY-MM-DD."
        ) from exc
