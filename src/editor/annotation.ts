import { Annotation } from '../core/editor'
import { KEY_REG } from '../utils'
import { KeyDetector } from '../utils'

class AnnotationProvider extends Annotation {
  get KEY_REG() {
    return KEY_REG
  }

  transformKey(text, key) {
    return KeyDetector.normalizeKey(key, text)
  }
}

export const annotationEditor = () => {
  const annotation = new AnnotationProvider()
  return annotation.disposables
}
