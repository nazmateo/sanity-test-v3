import {defineArrayMember} from 'sanity'

type BlockType = {type: string}

export const pageBuilderAtomBlockTypes: BlockType[] = [
  defineArrayMember({type: 'aboutUsStat'}),
  defineArrayMember({type: 'cbButton'}),
  defineArrayMember({type: 'splitArrowButton'}),
  defineArrayMember({type: 'cbHeading'}),
  defineArrayMember({type: 'cbParagraph'}),
  defineArrayMember({type: 'cbWysiwyg'}),
  defineArrayMember({type: 'cbHtml'}),
  defineArrayMember({type: 'cbImage'}),
]

export const pageBuilderContainerBlockTypes: BlockType[] = [
  defineArrayMember({type: 'cbButtons'}),
  defineArrayMember({type: 'cbColumns'}),
  defineArrayMember({type: 'cbGroup'}),
  defineArrayMember({type: 'cbList'}),
  defineArrayMember({type: 'cbNavigation'}),
  defineArrayMember({type: 'cbCover'}),
]

export const pageBuilderSectionBlockTypes: BlockType[] = [
  ...pageBuilderContainerBlockTypes,
  defineArrayMember({type: 'aboutUsSection'}),
  defineArrayMember({type: 'heroSection'}),
]

export const pageBuilderComposableBlockTypes: BlockType[] = [
  ...pageBuilderAtomBlockTypes,
  ...pageBuilderContainerBlockTypes,
]
