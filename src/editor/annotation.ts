import { Annotation } from '../core/editor'
import { KEY_REG } from '../utils'
import { KeyDetector } from '../utils'

class AnnotationProvider extends Annotation {
  get KEY_REG() {
    return KEY_REG
  }

  transformKey(text, key) {
    const prefix =
      KeyDetector.getKeyPrefixByKey(key) || KeyDetector.getKeyPrefixByText(text)

    return `${prefix}.${key}`
  }
}

export const annotationEditor = () => {
  const annotation = new AnnotationProvider()
  return annotation.disposables
}
