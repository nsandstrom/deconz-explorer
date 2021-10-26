const replaceChildren = (parent, newChildren) =>
  newChildren.forEach((newItem) => {
    const existingItem = parent.children.namedItem(newItem.id)

    if (!existingItem) {
      parent.appendChild(newItem)
      return
    }

    if (!existingItem.isEqualNode(newItem)) {
      parent.replaceChild(newItem, existingItem)
    }
  })


const Helpers = { replaceChildren }

export { Helpers }