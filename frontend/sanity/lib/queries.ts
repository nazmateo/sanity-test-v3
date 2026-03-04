import {defineQuery} from 'next-sanity'

const navigationLinksProjection = /* groq */ `
  ...,
  link{
    ...,
    "internalPageSlug": internalPage->slug.current
  },
  subLinks[]{
    ...,
    link{
      ...,
      "internalPageSlug": internalPage->slug.current
    }
  }
`

export const settingsQuery = defineQuery(`
  *[_type == "settings"][0]{
    ...,
    header{
      ...,
      ctaLink{
        ...,
        "internalPageSlug": internalPage->slug.current
      },
      primaryMenu{
        ...,
        links[]{
          ${navigationLinksProjection}
        }
      },
      secondaryMenu{
        ...,
        links[]{
          ${navigationLinksProjection}
        }
      }
    },
    footer{
      ...,
      menu{
        ...,
        links[]{
          ${navigationLinksProjection}
        }
      },
      legalMenu{
        ...,
        links[]{
          ${navigationLinksProjection}
        }
      }
    },
    primaryMenu{
      ...,
      links[]{
        ${navigationLinksProjection}
      }
    },
    secondaryMenu{
      ...,
      links[]{
        ${navigationLinksProjection}
      }
    },
    menuGroups[]{
      ...,
      links[]{
        ${navigationLinksProjection}
      }
    }
  }
`)

const cbButtonWithLinkProjection = /* groq */ `
  _type == "cbButton" => {
    ...,
    link{
      ...,
      "internalPageSlug": internalPage->slug.current
    }
  }
`

const cbButtonsWithLinksProjection = /* groq */ `
  _type == "cbButtons" => {
    ...,
    items[]{
      ...,
      link{
        ...,
        "internalPageSlug": internalPage->slug.current
      }
    }
  }
`

const cbNavigationWithLinksProjection = /* groq */ `
  _type == "cbNavigation" => {
    ...,
    links[]{
      ...,
      link{
        ...,
        "internalPageSlug": internalPage->slug.current
      }
    }
  }
`

const cbWysiwygWithResolvedLinksProjection = /* groq */ `
  _type == "cbWysiwyg" => {
    ...,
    content[]{
      ...,
      markDefs[]{
        ...,
        _type == "link" => {
          ...,
          "page": page->slug.current
        }
      }
    }
  }
`

export const getPageQuery = defineQuery(`
  *[
    _type == 'page' &&
    slug.current == $slug &&
    coalesce(language, "en") == $language
  ][0]{
    _id,
    _type,
    name,
    language,
    slug,
    seo{
      ...,
      ogImage{
        ...,
        asset->
      }
    },
    structuredData,
    "pageBuilder": pageBuilder[]{
      ...,
      ${cbButtonWithLinkProjection},
      ${cbButtonsWithLinksProjection},
      ${cbNavigationWithLinksProjection},
      ${cbWysiwygWithResolvedLinksProjection},
      _type == "cbGroup" => {
        ...,
        children[]{
          ...,
          ${cbButtonWithLinkProjection},
          ${cbButtonsWithLinksProjection},
          ${cbNavigationWithLinksProjection},
          ${cbWysiwygWithResolvedLinksProjection}
        }
      },
      _type == "cbColumn" => {
        ...,
        children[]{
          ...,
          ${cbButtonWithLinkProjection},
          ${cbButtonsWithLinksProjection},
          ${cbNavigationWithLinksProjection},
          ${cbWysiwygWithResolvedLinksProjection}
        }
      },
      _type == "cbCover" => {
        ...,
        content[]{
          ...,
          ${cbButtonWithLinkProjection},
          ${cbButtonsWithLinksProjection},
          ${cbNavigationWithLinksProjection},
          ${cbWysiwygWithResolvedLinksProjection}
        }
      },
      _type == "cbColumns" => {
        ...,
        columns[]{
          ...,
          children[]{
            ...,
            ${cbButtonWithLinkProjection},
            ${cbButtonsWithLinksProjection},
            ${cbNavigationWithLinksProjection},
            ${cbWysiwygWithResolvedLinksProjection}
          }
        }
      }
    }
  }
`)

export const homePageQuery = defineQuery(`
  *[
    _type == "homePage" &&
    coalesce(language, "en") == $language
  ][0]{
    _id,
    _type,
    name,
    seo{
      ...,
      ogImage{
        ...,
        asset->
      }
    },
    structuredData,
    "pageBuilder": pageBuilder[]{
      ...,
      ${cbButtonWithLinkProjection},
      ${cbButtonsWithLinksProjection},
      ${cbNavigationWithLinksProjection},
      ${cbWysiwygWithResolvedLinksProjection},
      _type == "cbGroup" => {
        ...,
        children[]{
          ...,
          ${cbButtonWithLinkProjection},
          ${cbButtonsWithLinksProjection},
          ${cbNavigationWithLinksProjection},
          ${cbWysiwygWithResolvedLinksProjection}
        }
      },
      _type == "cbColumn" => {
        ...,
        children[]{
          ...,
          ${cbButtonWithLinkProjection},
          ${cbButtonsWithLinksProjection},
          ${cbNavigationWithLinksProjection},
          ${cbWysiwygWithResolvedLinksProjection}
        }
      },
      _type == "cbCover" => {
        ...,
        content[]{
          ...,
          ${cbButtonWithLinkProjection},
          ${cbButtonsWithLinksProjection},
          ${cbNavigationWithLinksProjection},
          ${cbWysiwygWithResolvedLinksProjection}
        }
      },
      _type == "cbColumns" => {
        ...,
        columns[]{
          ...,
          children[]{
            ...,
            ${cbButtonWithLinkProjection},
            ${cbButtonsWithLinksProjection},
            ${cbNavigationWithLinksProjection},
            ${cbWysiwygWithResolvedLinksProjection}
          }
        }
      }
    }
  }
`)

export const homePageLanguagesQuery = defineQuery(`
  *[_type == "homePage"]{
    "language": coalesce(language, "en")
  }
`)

export const sitemapData = defineQuery(`
  *[
    (_type == "homePage") ||
    (_type == "page" && defined(slug.current)) ||
    (_type == "legalPage" && defined(slug))
  ] | order(_type asc) {
    "slug": select(_type == "legalPage" => slug, slug.current),
    "language": coalesce(language, "en"),
    _type,
    _updatedAt,
  }
`)

export const legalPageBySlugQuery = defineQuery(`
  *[
    _type == "legalPage" &&
    slug == $slug &&
    coalesce(language, "en") == $language
  ][0]{
    _id,
    title,
    slug,
    language,
    content,
    seo{
      ...,
      ogImage{
        ...,
        asset->
      }
    }
  }
`)

export const pagesSlugs = defineQuery(`
  *[
    _type == "page" &&
    defined(slug.current) &&
    coalesce(language, "en") == $language
  ]
  {"slug": slug.current}
`)

export const localizedPagesSlugs = defineQuery(`
  *[
    _type == "page" &&
    defined(slug.current) &&
    coalesce(language, "en") != $defaultLanguage
  ]{
    "slug": slug.current,
    "language": coalesce(language, "en")
  }
`)

export const pageLanguagesBySlugQuery = defineQuery(`
  *[
    _type == "page" &&
    slug.current == $slug
  ]{
    "language": coalesce(language, "en")
  }
`)

export const legalPageLanguagesBySlugQuery = defineQuery(`
  *[
    _type == "legalPage" &&
    slug == $slug
  ]{
    "language": coalesce(language, "en")
  }
`)
