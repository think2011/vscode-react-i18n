import { Annotation } from '../core/editor'
import { KEY_REG } from '../utils'

class AnnotationProvider extends Annotation {
  get KEY_REG() {
    return KEY_REG
  }

  transformKey(text, key) {
    // TODO: 转换为对应的key
    return key
  }
}

export const annotationEditor = () => {
  const annotation = new AnnotationProvider()
  return annotation.disposables
}
