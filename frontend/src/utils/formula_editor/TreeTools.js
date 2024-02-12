export const getItemByKey = (tree, key) => {
    if (tree instanceof Array) {
        for (let i in tree) {
            let res = getItemByKey(tree[i], key)
            if (res) {
                return res
            }
        }
    }
    if (tree.key === key) {
        return tree
    }
    if (tree.children) {
        return getItemByKey(tree.children, key)
    }
}