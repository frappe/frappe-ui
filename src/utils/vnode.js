import { Comment, Fragment, Text } from 'vue';
function normalizeNodes(nodes) {
    if (!nodes)
        return [];
    return Array.isArray(nodes) ? nodes : [nodes];
}
export function hasRenderableContent(nodes) {
    return normalizeNodes(nodes).some((node) => {
        if (node.type === Comment)
            return false;
        if (node.type === Text) {
            return String(node.children ?? '').trim().length > 0;
        }
        if (node.type === Fragment) {
            return hasRenderableContent(Array.isArray(node.children) ? node.children : []);
        }
        return true;
    });
}
export function getFirstRenderableElement(content) {
    for (const node of normalizeNodes(content)) {
        if (!node || typeof node !== 'object') {
            continue;
        }
        if (node.type === Comment) {
            continue;
        }
        if (node.type === Text) {
            if (String(node.children ?? '').trim().length > 0) {
                return node;
            }
            continue;
        }
        if (node.type === Fragment) {
            const children = Array.isArray(node.children)
                ? node.children
                : [];
            const renderableChild = getFirstRenderableElement(children);
            if (renderableChild) {
                return renderableChild;
            }
            continue;
        }
        return node;
    }
    return null;
}
