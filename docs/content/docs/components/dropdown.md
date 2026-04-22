# Dropdown

A flexible menu component for selecting actions or options. Easily handles
lists, groups, and nested items in a clean. Supports switches, disabled items,
custom triggers.

## Notes

- Use `#trigger` for the explicit custom trigger API. The default slot remains a
  supported shorthand when trigger customization is all you need.
- Prefer `#item-prefix`, `#item-label`, and `#item-suffix` when you want to
  customize the standard dropdown row shell.
- Use `#item` or `item.component` only when you need to replace the entire row.
  Those escape hatches own the outer menu item element, so they should be
  reserved for exceptional cases.

<!-- AUTO-GENERATED STORIES START -->

## Basic

<ComponentPreview name="Dropdown-01_Basic" />

## Menu patterns

<ComponentPreview name="Dropdown-02_MenuPatterns" />

## Trigger patterns

<ComponentPreview name="Dropdown-03_TriggerPatterns" />

## User menu

<ComponentPreview name="Dropdown-04_UserMenu" />

## Content customization

<ComponentPreview name="Dropdown-05_ContentCustomization" />

<!-- AUTO-GENERATED STORIES END -->

<!-- @include: ../../../meta/Dropdown.md -->
