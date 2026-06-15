import markdown
import frontmatter
import html
import xml.etree.ElementTree as etree

from datetime import date
from pathlib import Path
from markdown.inlinepatterns import InlineProcessor
from markdown.extensions import Extension

from html_utils import extract_first_paragraph, truncate_description
from post_models import Post
from settings import DESCRIPTION_CHAR_LIMIT, TEMPLATE_PATH


class RubyPattern(InlineProcessor):
    def handleMatch(self, m, data):
        el = etree.Element("ruby")
        el.text = m.group(1)
        rt = etree.SubElement(el, "rt")
        rt.text = m.group(2)
        return el, m.start(0), m.end(0)


class RubyExtension(Extension):
    def extendMarkdown(self, md):
        # Matches {text|ruby}
        md.inlinePatterns.register(RubyPattern(r"\{([^|}]+)\|([^}]+)\}", md), "ruby", 175)


class PostValidationError(ValueError):
    pass


def load_post(source_path: Path) -> tuple[Post, str, str]:
    document = frontmatter.load(source_path)
    title = _require_string_field(document.metadata, "title", source_path)
    created_on = _require_iso_date(document.metadata, "date", source_path)

    html_content = markdown.markdown(
        document.content, extensions=["fenced_code", "extra", RubyExtension()]
    )
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
    full_html = render_post_html(
        title=title,
        date_text=created_on.isoformat(),
        content=html_content,
        description=html.escape(description, quote=True),
    )
    return post, output_name, full_html


def render_post_html(*, title: str, date_text: str, content: str, description: str) -> str:
    template = TEMPLATE_PATH.read_text(encoding="utf-8")
    return (
        template.replace("{title}", title)
        .replace("{date_text}", date_text)
        .replace("{content}", content)
        .replace("{description}", description)
    )


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
