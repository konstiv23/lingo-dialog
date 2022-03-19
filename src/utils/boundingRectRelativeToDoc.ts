export default function boundingRectRelativeToDoc(rect: DOMRect) {
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
  } as DOMRect;
}
