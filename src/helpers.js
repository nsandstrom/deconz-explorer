const replaceChildren = (parent, newChildren, lock = () => false) =>
  newChildren.forEach((newItem) => {
    const existingItem = parent.children.namedItem(newItem.id)

    if (!existingItem) {
      parent.appendChild(newItem)
      return
    }

    if (lock(existingItem)) {
      console.log('item is locked from updating')
      return
    }

    if (!existingItem.isEqualNode(newItem)) {
      parent.replaceChild(newItem, existingItem)
    }
  })

const Helpers = { replaceChildren }

export { Helpers }
