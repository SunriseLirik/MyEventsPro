const https = require('https')
const fs = require('fs')
const path = require('path')

const imagesDir = path.join(__dirname, '..', 'public', 'images', 'events')

const images = [
  {
    name: 'jazz-evening-garden',
    prompt: 'Elegant outdoor jazz evening in a garden, live saxophone on stage, warm ambient lights, audience at round tables, professional event photography, high quality',
  },
  {
    name: 'pasta-making-masterclass',
    prompt: 'Italian pasta making culinary masterclass, chef hands rolling fresh dough on wooden table, flour, eggs, rustic kitchen, warm natural light, professional food photography',
  },
  {
    name: 'new-horizons-art-exhibition',
    prompt: 'Modern art exhibition in white gallery hall, abstract paintings on walls, visitors viewing colorful contemporary artwork, professional museum photography',
  },
  {
    name: 'run-moscow-marathon',
    prompt: 'City marathon in spring, thousands of runners on wide avenue, sunny morning, Moscow cityscape background, energetic sports event photography',
  },
  {
    name: 'data-science-intensive',
    prompt: 'Data science and AI online course, modern laptop screen with code and neural network visualization, futuristic technology education concept, clean professional style',
  },
  {
    name: 'sustainability-forum',
    prompt: 'Sustainability and ecology forum, speaker on stage with green nature presentation, professional conference audience, modern auditorium, bright lighting',
  },
  {
    name: 'street-food-festival',
    prompt: 'Vibrant street food festival, food trucks, crowd of people eating outdoors, colorful market lights, lively urban park atmosphere, professional event photography',
  },
]

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download ${url}: ${response.statusCode}`))
          return
        }
        response.pipe(file)
        file.on('finish', () => {
          file.close(resolve)
        })
      })
      .on('error', (err) => {
        fs.unlink(dest, () => {})
        reject(err)
      })
  })
}

async function main() {
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true })
  }

  for (const item of images) {
    const dest = path.join(imagesDir, `${item.name}-0.jpg`)
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`✅ ${item.name}-0.jpg already exists`)
      continue
    }

    const encodedPrompt = encodeURIComponent(item.prompt)
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&nologo=true&seed=${Math.floor(Math.random() * 100000)}`

    try {
      console.log(`⬇️ Downloading ${item.name}-0.jpg...`)
      await downloadImage(url, dest)
      console.log(`✅ ${item.name}-0.jpg downloaded`)
    } catch (error) {
      console.error(`❌ ${item.name}-0.jpg failed:`, error.message)
    }
  }
}

main()
