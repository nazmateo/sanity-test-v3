import {draftMode} from 'next/headers'

import HeaderClient from '@/app/components/HeaderClient'
import type {HeaderSettings, HeaderVariant} from '@/sanity/lib/settings-types'

type HeaderProps = {
  header?: HeaderSettings | null
  variant?: HeaderVariant | null
}

export default async function Header({header, variant = 'positive'}: HeaderProps) {
  if (!header?._id) {
    return null
  }

  const {isEnabled: isDraftMode} = await draftMode()

  return <HeaderClient header={header} variant={variant} isDraftMode={isDraftMode} />
}
