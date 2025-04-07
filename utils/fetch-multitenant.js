const fs = require('fs')
require('dotenv').config();
const { env } = require('process')

const lottusColors = {
  primary: {
    intensity0: '#e3fffc',
    intensity50: '#c6fff8',
    intensity100: '#8dfff1',
    intensity200: '#55ffea',
    intensity300: '#1cffe3',
    intensity400: '#00e2c6',
    intensity500: '#00a994',
    intensity600: '#008d7b',
    intensity700: '#007163',
    intensity800: '#00554a',
    intensity900: '#003831',
    intensity950: '#001c19',
  },
  secondary: {
    intensity0: '#ced4de',
    intensity50: '#9caabd',
    intensity100: '#7f8ea5',
    intensity200: '#63738e',
    intensity300: '#485977',
    intensity400: '#2e4061',
    intensity500: '#13294b',
    intensity600: '#10223f',
    intensity700: '#0d1b32',
    intensity800: '#0a1426',
    intensity900: '#060e19',
    intensity950: '#03070d',
  },
  surface: {
    intensity0: '#FFFFFF',
    intensity50: '#FAFAFA',
    intensity100: '#F4F4F5',
    intensity200: '#E4E4E7',
    intensity300: '#D4D4D8',
    intensity400: '#A1A1AA',
    intensity500: '#71717A',
    intensity600: '#52525B',
    intensity700: '#3F3F46',
    intensity800: '#27272A',
    intensity900: '#18181B',
    intensity950: '#000000',
  },
  error:{
    intensity0: '#EFF4FC',
    intensity50: '#DFE9F9',
    intensity100: '#C0D2F4',
    intensity200: '#A0BCEE',
    intensity300: '#80A6E8',
    intensity400: '#618FE3',
    intensity500: '#4179DD',
    intensity600: '#2460CA',
    intensity700: '#1D4DA2',
    intensity800: '#163979',
    intensity900: '#0E2651',
    intensity950: '#071328',
  },
  success:{
    intensity0: '#FDF9F0',
    intensity50: '#FAF3E1',
    intensity100: '#F6E8C3',
    intensity200: '#F1DCA6',
    intensity300: '#ECD088',
    intensity400: '#ECD088',
    intensity500: '#E3B94C',
    intensity600: '#DAA722',
    intensity700: '#AF861B',
    intensity800: '#836414',
    intensity900: '#57430D',
    intensity950: '#2C2107',
  },
  warning:{
    intensity0: '#FDF4F2',
    intensity50: '#FBE8E5',
    intensity100: '#F6D1CC',
    intensity200: '#F2BAB2',
    intensity300: '#EEA398',
    intensity400: '#E98C7F',
    intensity500: '#E57565',
    intensity600: '#DD4B36',
    intensity700: '#BC3320',
    intensity800: '#8D2718',
    intensity900: '#5E1A10',
    intensity950: '#2F0D08',
  },
  info:{
    intensity0: '#EEF9EC',
    intensity50: '#DDF2D9',
    intensity100: '#BCE6B3',
    intensity200: '#9AD98C',
    intensity300: '#78CC66',
    intensity400: '#56C040',
    intensity500: '#459A33',
    intensity600: '#39802A',
    intensity700: '#2E6722',
    intensity800: '#224D19',
    intensity900: '#173311',
    intensity950: '#0B1A08',
  },
}

const lottusFonts = {
  headings: { google_font_url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap', font_names: [{ name: 'Poppins'}] },
  texts: { google_font_url: 'https://fonts.googleapis.com/icon?family=Nunito+Sans:wght@400&display=swap', font_names: [{ name: 'Nunito Sans'}] },
  icons: { google_font_url: 'https://fonts.googleapis.com/icon?family=Material+Icons', font_names: [{ name: 'Material Icons'}] }
}

const lottusLogos = {
  logo: '../public/images/lottus.png',
  favicon: '/public/images/lottus-favicon.png',
  errorLogos: [
    {
      "error_code": "404",
      "default_message": "hubo un error inesperado",
      "default_title": "lo sentimos",
      "image": "https://pro-portalverse-lottus.s3.amazonaws.com/UTEG/404_068eb52796.jpg" // TODO: change image to lottus error
    }
  ]
}

const setcolors = (colors) => {
  return Object.keys(colors).reduce((acc, key) => {
    acc = {
      ...acc,
      [key]: {
        0: colors[key].intensity0,
        50: colors[key].intensity50,
        100: colors[key].intensity100,
        200: colors[key].intensity200,
        300: colors[key].intensity300,
        400: colors[key].intensity400,
        500: colors[key].intensity500,
        600: colors[key].intensity600,
        700: colors[key].intensity700,
        800: colors[key].intensity800,
        900: colors[key].intensity900,
        950: colors[key].intensity950,
      }
    }
    return acc
  }, {}) 
  
}

const axios = require('axios');

async function downloadImage(url, filename, path = '') {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  fs.writeFile(`${path}${filename}`, response.data, (err) => {
    if (err) throw err;
    console.log('Image downloaded successfully!');
  });
}

async function fetchColors(){
  try {
    const rawColors = await
    fetch(`${env.NEXT_PUBLIC_MULTITENANT_URL}/pallete?populate[0]=primary,secondary,surface,complementary.colors,contextual.success,contextual.error,contextual.warning,contextual.info`, {
      headers: {
        "Authorization": `Bearer ${env.NEXT_PUBLIC_MULTITENANT_TOKEN}`
      }
    })
  
    const Colors = await rawColors.json() 
    const { data : { attributes: { primary, secondary, surface, contextual:{id, ...restcontextual}, complementary } } } = Colors
  
    const complementaryColors = complementary.reduce((acc, {token, colors}) => {
      const { id, ...rest } = colors
      acc = {...acc, [token]: { ...rest}}
      return acc
    }, {})
  
    return {primary, secondary, surface, ...restcontextual, ...complementaryColors}
  } catch (error) {
    console.error(error)
    console.info('using lottus default colors')
    return lottusColors
  }
}
const setFontVariation = (url, name) => {
  const first = url.split('@')
  const second = first[1] ? first[1].split('&') : ""
  const weights = second ? second[0].split(';') : [];

  const variants = weights.map((weight) => 
`@supports (font-variation-settings: "wght" ${weight}) {
  * {
    font-family: '${name}';
    font-weight: ${weight};
    font-display: swap;
  }
}`)
  return variants
}
const setFonts = (fonts) => {
  return Object.keys(fonts).reduce((acc, token) => {
    const font = fonts[token]
    acc.tokens = [...acc.tokens, `font-${token}`]
    if (font.font) {
      acc.fonts = {
        ...acc.fonts,
        [token]: [ font.font ]
      }
    } else {

      const { google_font_url, font_names } = font
      acc.fonts = {
        ...acc.fonts,
        [token]: font_names.map((font)=> font.name)
      }
      const variants = setFontVariation(google_font_url, font_names[0].name).join('\n')
      acc.variants = `${acc.variants}\n\n${variants}`
      acc.links = [...acc.links, google_font_url]
    }
    
    return acc
  }, { links: [''], variants: '', fonts: {}, tokens: [''] }) 
  
}

async function fetchFonts(){
  try {
    const rawFonts = await
    fetch(`${env.NEXT_PUBLIC_MULTITENANT_URL}/font?populate[0]=headings,texts,extra_fonts,icons,headings.font_names,texts.font_names,icons.font_names,extra_fonts.font,extra_fonts.font.font_names`, {
      headers: {
        "Authorization": `Bearer ${env.NEXT_PUBLIC_MULTITENANT_TOKEN}`
      }
    })
  
    const Fonts = await rawFonts.json() 
    const { data : { attributes: { headings, texts, extra_fonts, icons } } } = Fonts
  
    const extraFonts = extra_fonts.reduce((acc, {token, font}) => {
      const { id, ...rest } = font
      acc = {...acc, [token]: rest}
      return acc
    }, {})
    const fonts = { headings: headings[0], texts: texts[0], ...extraFonts, icons: icons[0] }
    
    return fonts
  } catch (error) {
    console.error(error);
    console.info('using lottus default fonts')
    return lottusFonts
  }
}

const setLogos = (logos) => {
  return Object.keys(logos) .reduce((acc, token) => {
    if (token === "errorLogos") {
      logos[token].map((error) => {
        const err = {[error.error_code]: error}
        acc.errors = { ...acc.errors, ...err}
        return err
      })
    } else {
      acc.css[token] = `url('${logos[token]}')`
      acc.tokens = [...acc.tokens, `bg-${token}`]
      acc.img = `${acc.img}\n export const ${token} = "${logos[token]}"`
    }
    return acc
  }, { css: {}, img: '', tokens: [''], errors: {} })
}

async function fetchLogos(){
  try {
    const rawLogos = await
    fetch(`${env.NEXT_PUBLIC_MULTITENANT_URL}/logo?populate=logo,favicon,extra_logos,extra_logos.image,error_logos,error_logos.error_image`, {
      headers: {
        "Authorization": `Bearer ${env.NEXT_PUBLIC_MULTITENANT_TOKEN}`
      }
    })
  
    const Logos = await rawLogos.json() 
    const { data : { attributes: { logo, favicon, extra_logos, error_logos } } } = Logos
  
    if (favicon) {
      downloadImage(favicon?.data?.attributes?.url, 'favicon.ico', 'public/');
    }
    
    const extraLogos = extra_logos.reduce((acc, {logo_token, image}) => {    
      const { data: { attributes: { url } } } = image
      acc = {...acc, [logo_token]: url}
      return acc
    }, {})
    const errorLogos = error_logos.reduce((acc, { error_code, error_image: { data: { attributes: { url }}}, default_title, default_message }) => {    
      acc = [ ...acc, { error_code, default_message, default_title, image: url }]
      return acc
    }, [])
    errorLogos
  
    return {
      logo: logo.data.attributes.url,
      favicon: favicon.data.attributes.url,
      ...extraLogos,
      errorLogos
    }
  } catch (error) {
    console.error(error);
    console.info('using lottus logos');
    return lottusLogos;
  }
}

// const setConfig = ({ styles_safelist, environment_variables }) => {
  
//   const safelist = styles_safelist.map(({ token }) => token)
//   const variables = environment_variables.reduce((acc, { token, value }) => {
//     acc = `${acc}${[token]}=${value}\n}`
//     return acc
//   }, '')
//   return { safelist, variables }
// }

// async function fetchConfig(){

//   const rawConfig = await
//   fetch(`${env.NEXT_PUBLIC_MULTITENANT_URL}/config?populate=styles_safelist,environment_variables`, {
//     headers: {
//       "Authorization": `Bearer ${env.NEXT_PUBLIC_MULTITENANT_TOKEN}`
//     }
//   })
//   console.log("rawConfig", rawConfig)
//   const Config = await rawConfig.json() 
//   console.log("Config", Config)
//   const { data : { attributes } } = Config

//   return attributes
// }

async function populateTailwind() {
  const tailwindColors = setcolors(await fetchColors())
  const tailwindFonts = setFonts(await fetchFonts())
  const tailwindLogos = setLogos(await fetchLogos())
  // const config = setConfig(await fetchConfig())

  const [_fontfirst, ...fontrest] = tailwindFonts.tokens
  const fonttokens = fontrest
  const [_logosfirst, ...logosrest] = tailwindLogos.tokens
  const logostokens = logosrest
  const newBase = {
    presets: [],
    safelist: [
      ...fonttokens,
      ...logostokens
    ],
    theme: {
      colors: {
        ...tailwindColors
      },
      fontFamily: {
        ...tailwindFonts.fonts
      },
      extend: {
        backgroundImage: {
          ...tailwindLogos.css
        }
      }
    }
  }
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */ \n\nmodule.exports = ${JSON.stringify(newBase, null, 2)}`

  fs.writeFile('./tailwindBase.js', tailwindConfig, 'utf-8', (err) => {
    if (err) {
      console.error(err);
    }
  });
  fs.mkdir("./styles", null, (err, data) => {
    fs.writeFile('./styles/fonts.css', `${tailwindFonts.variants}`, 'utf-8', (err) => {
      if (err) {
        console.error(err);
      }
    });
  })
  fs.writeFile('./multitenant-images.ts', tailwindLogos.img, 'utf-8', (err) => {
    if (err) {
      console.error(err);
    }
  });
  fs.writeFile('./multitenant-errors.ts', `const errors: {[key:string]: { error_code:string; default_message:string; default_title:string; image:string; }} = ${JSON.stringify(tailwindLogos.errors, null, 2)} \n export default errors`, 'utf-8', (err) => {
    if (err) {
      console.error(err);
    }
  });
  const [_fontsfirst, ...fontsrest] = tailwindFonts.links
  const fontslinks = fontsrest

  fs.writeFile('./fontlinks.ts', `const links = ${JSON.stringify(fontslinks, null, 2)} \n export default links;`, 'utf-8', (err) => {
    if (err) {
      console.error(err);
    }
  });
  console.log("built multitenant styles")
}
populateTailwind()
