function findParent(context, componentName) {
  let parent = context.$parent;
  let name = parent.$options.name;
  while (parent && (!name || [componentName].indexOf(name) === -1)) {
    parent = parent.$parent;
    if (parent) {
      name = parent.$options.name;
    }
  }
  return parent;
}

function findAllParent(context, componentName) {
  let parents = [];
  let parent = context.$parents;

  if (parent) {
    if (parent.$options.name === componentName) {
      parents.push(parent);
    }
    return parents.concat(findAllParent(parent, componentName));
  } else {
    return [];
  }
}

function findChild(context, componentName) {
  let childrens = context.$children;
  let children = null;
  if (childrens) {
    for (const child of childrens) {
      if (child.$options.name === componentName) {
        children = child;
        break;
      } else {
        children = findChild(child, componentName);
        if (children) {
          break;
        }
      }
    }
  }
  return children;
}

function findAllChild(context, componentName) {
  return context.$children.reduce((components, child) => {
    if (child.$options.name === componentName) {
      components.push(child);
    }
    const comps = findAllChild(child, componentName);
    return components.concat(comps);
  }, []);
}

function findSiblingsChild(context, componentName, exceptMe = true) {
  return context.$parent.$children.filter(item => {
    if (!exceptMe) {
      return item.$options.name === componentName && item._uid !== context._uid;
    } else {
      return item.$options.name === componentName;
    }
  });
}

export {
  findParent,
  findAllParent,
  findChild,
  findAllChild,
  findSiblingsChild
};
