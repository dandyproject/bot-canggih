const { create, decryptMedia } = require('@open-wa/wa-automate')
const fs = require('fs-extra')
const moment = require('moment')
const fetch = require('node-fetch')
const axios = require('axios')
const {artinama,
    quotes,
    weton,
    corona,
    alay,
    namaninjaku,
    liriklagu,
    quotemaker,
    yt,
    ytmp3,
    gd,
    jodoh,
    hilih,
    weather,
} = require('./lib/functions')
const gttsEn = require('node-gtts')('en')
const gttsId = require('node-gtts')('id')
const path = require('path')
const pathId = path.join(__dirname, 'tts_id.wav')
const pathEn = path.join(__dirname, 'tts_en.wav')
const kopit = require('./korona')
const fbvid = require('fbvideos');

const serverOption = {
    headless: true,
    qrRefreshS: 20,
    qrTimeout: 0,
    authTimeout: 0,
    autoRefresh: true,
    devtools: false,
    cacheEnabled:false,
    chromiumArgs: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
}

const opsys = process.platform;
if (opsys == "win32" || opsys == "win64") {
serverOption['executablePath'] = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
} else if (opsys == "linux") {
serverOption['browserRevision'] = '737027';
} else if (opsys == "darwin") {
serverOption['executablePath'] = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
}

const startServer = async (from) => {
create('Imperial', serverOption)
        .then(client => {
            console.log('[SERVER] Server Started!')

            // Force it to keep the current session
            client.onStateChanged(state => {
                console.log('[State Changed]', state)
                if (state === 'CONFLICT') client.forceRefocus()
            })

            client.onMessage((message) => {
                msgHandler(client, message)
            })
        })
}

freedomurl = "https://i.ibb.co/6J9ST0d/IMG-20200731-WA0791.jpg"

async function msgHandler (client, message) {
    try {
        // console.log(message)
        const { type, body, from, t, sender, isGroupMsg, chat, groupMetadata, caption, isMedia, mimetype, quotedMsg } = message
        const { id, pushname } = sender
        const { name } = chat
        const time = moment(t * 1000).format('DD/MM HH:mm:ss')
        const commands = ['Stiker', 'stiker', 'STIKER', '#stiker', '#sticker', 'Sticker', 'setiker', 'sticker',  'Support', 'Info','Covid','Join','Lirik','Quotemaker','Menu','Owner','Hai','halo','Meme','Add','Kick','Kontak','Promote','Demote','Admin','LinkGrup','RevLinkGrup','Seasonal anime','Neko','Wallpaper','Thank you','Grup bot', 'Mysteri Video', 'Join','Assalamualaikum','quote','quotes','Quote','Mystery Video','Pokemon','Waifu','#waifu','dfb','ytmp3','Toxic']
        const cmds = commands.map(x => x + '\\b').join('|')
        const cmd = type === 'chat' ? body.match(new RegExp(cmds, 'gi')) : type === 'image' && caption ? caption.match(new RegExp(cmds, 'gi')) : ''

        if (cmd) {
            if (!isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(cmd[0]), 'from', color(pushname))
            if (isGroupMsg) console.log(color('[EXEC]'), color(time, 'yellow'), color(cmd[0]), 'from', color(pushname), 'in', color(name))
            const args = body.trim().split(' ')
            switch (cmd[0]) {
                case 'Stiker':
                case 'stiker':
                case 'sticker':
                case 'STIKER':
                case '#sticker':
                case '#stiker':
                case 'Sticker':
                case 'setiker':
                    if (isMedia) {
                        const mediaData = await decryptMedia(message)
                        const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                        await client.sendImageAsSticker(from, imageBase64, message)
                    } else if (quotedMsg && quotedMsg.type == 'image') {
                        const mediaData = await decryptMedia(quotedMsg)
                        const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                        await client.sendImageAsSticker(from, imageBase64, message)
                    } else if (args.length == 2) {
                        var isUrl = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi);
                        const url = args[1]
                        if (url.match(isUrl)) {
                            await client.sendStickerfromUrl(from, url, { method: 'get' })
                                .catch(err => console.log('Caught exception: ', err))
                        } else {
                            client.sendText(from, 'Url is invalid')
                        }
                    } else {
                        client.reply(from, `You did not quote a picture, *${pushname}* Baka! Untuk Membuat Siker, Kirim atau Balas Gambar Dengan Caption stiker`, message)
                    }
                    break
                case 'Halo':
                        client.reply(from, `Halo *${pushname}*, Ada yang bisa saya bantu?`, message)
                    break
		/*case '!covid':
			const result = await kopit()
			client.sendText(from, kopit())
		    break*/
		case 'ytmp3':
			if (args.length >=2){
                        	const url = args[1]
                        	const result = await ytmp3(url)
                        	client.sendFileFromUrl(from, result , 'audio.mp3')
			}else{
				client.reply(from, 'usage:\n!ytmp3 https://youtu.be/6l5V3BWDcMw', message)
}
                    break
		case 'Lirik':
			if(args.length == 2){
                        	const lagu = args[1]
                        	const result = await liriklagu(lagu)
                        	client.sendText(from, result)
			}else{
				client.reply(from, 'usage:\n\nLirik aku-bukan-boneka\n"-" = spasi', message)
}
                    break
	/*	case '!weather':
			if(args.length >= 2){
				const kota = args[1]
                        	const result = await weather(kota)
                        	client.sendText(from, result)
}
                    break*/
		case 'Quotemaker':            
                        if (args.length == 4) {
				client.sendText(from, 'Tunggu yaa, sedang proses . . .') 
                        	const quotes = args[1]
                        	const author = args[2]
                        	const theme = args[3]
                        	const result = await quotemaker(quotes, author, theme)
                        	client.sendFile(from, result, 'quotesmaker.jpg','neh buat lu:v...')
}
                    break
		case 'LinkGrup':
			if(isGroupMsg){
				const inviteLink = await client.getGroupInviteLink(chat.id);
				client.sendLinkWithAutoPreview(from, inviteLink, `\nLink group *${name}*`)
}
		    break
		case 'Owner':
			var owner = from.split('-')[0]
			client.sendText(from, `[${owner}]`)
		    break
		case 'Add':
			if(isGroupMsg){
				if(args.length >=2){
					var wkwk = `${from.split('-')[0]}@c.us`
					if(message.author === wkwk ){
						org = args[1]
						client.addParticipant(from,`${org}@c.us`)
					}else{
						client.reply(from, 'Fitur ini hanya bisa di pakai oleh admin [owner]', message)
		}
	}
}
		    break
		case 'Kick':
			if(isGroupMsg){
				if(args.length >=2){
					var wkwk = `${from.split('-')[0]}@c.us`
					if(message.author === wkwk ){
						wong = args[1]
						client.removeParticipant(from,`${wong}@c.us`)
					}else{
						client.reply(from, 'Fitur ini hanya bisa di pakai oleh admin[owner]', message)
		}
	}
}
		    break
	/*	case '!leave':
			if(isGroupMsg){
				client.sendText(from,'Sayonara')
				client.leaveGroup(from)
}
		    break*/
		case 'Promote':
			if(isGroupMsg){
				if(args.length >=2){
					var wkwk = `${from.split('-')[0]}@c.us`
					if(message.author === wkwk ){
						prom = args[1]
						client.promoteParticipant(from,`${prom}@c.us`)
					}else{
						client.reply(from, 'Fitur ini hanya bisa di pakai oleh admin[owner]', message)
		}
	}
}
		    break
		case 'Demote':
			if(isGroupMsg){
				if(args.length >=2){
					var wkwk = `${from.split('-')[0]}@c.us`
					if(message.author === wkwk ){
						demo = args[1]
						client.demoteParticipant(from,`${demo}@c.us`)
					}else{
						client.reply(from, 'Fitur ini hanya bisa di pakai oleh admin[owner]', message)
		}
	}
}
		    break
		case 'RevLinkGrup':
			if(isGroupMsg){
				client.revokeGroupInviteLink(chat.id);
				client.sendText(from, 'Tautan undangan berhasil di tarik')
}
		    break
		case 'Grup bot':
			if (args.length >=2) {
				const link = args[1]
				client.inviteInfo(link);
				client.joinGroupViaLink(link)
				client.sendText(from, 'SILAHKAN JOIN KE GRUP https://chat.whatsapp.com/LuGYe0lyE9yEydZQYI1Xhd UNTUK MENDAPATKAN LEBIH BANYAK STIKER*')
}
		    break
                case 'Kontak':
                        client.sendText(from, '*Kontak Owner* \n *Whatsapp: wa.me/6289636035164* \n *Instagram: @dandisubhani_* \n *Facebook*: https://www.facebook.com/ads.adandi20s*')
                    break
		case 'Support':
                        client.sendText(from, '*Kalo Ada Yang Mau Support (Ga Maksa) Boleh Ke* : \n *Dana*: 089636035164 \n *Gopay*: 089636035164 \n *OVO*: 089636035164 \n *Atau Pulsa Juga Bisa Ke* 085155335454 (By.U) \n *Atau Bisa Juga Lewat* saweria.co/donate/dandisubhani \n *Terima Kasih Lumayan Buat Nambahin Script:v*' )
                   break
    
                case '!God':
                        client.sendText(from, '@Hooman|Neko is God')
                    break
                 case 'Se no':
                        client.reply(from, 'Demo sonnan ja dame', message)
                    break
                 case 'Mou':
                        client.reply(from, 'sonnan ja hora', message)
                    break
                 case 'Kokoro':
                        client.sendText(from, 'wa shinka suru yo Motto motto')
                    break
                case '!Best girl':
                        client.sendText(from, '*Blushes*')
                    break
                case 'Zelda' :
                        client.sendText(from, 'Link')
                    break 
                case 'Indeed' :
                        client.sendText(from, 'Pathetic')
                    break 
		case 'Link' :
                        client.sendText(from, 'Zelda')
                    break
               case 'Hai' :
               case 'hai' :
                        client.sendText(from, '*Apa Sayang:v*')
                    break
                case 'freedom' :
                        client.sendFileFromUrl(from, 'https://i.ibb.co/6J9ST0d/IMG-20200731-WA0791.jpg','freedom.jpg','...')
                    break
                case '!Botw' :
                        client.sendFileFromUrl(from, 'https://mocah.org/uploads/posts/197514-princess-zelda-2350x1175.png','BOTW.jpg','...')
                    break
                case '!Zelda Timeline' :
                        client.sendFileFromUrl(from, 'https://gamepedia.cursecdn.com/zelda_gamepedia_en/b/b8/E_Timeline.png','Zelda Timeline.png','...')
                    break
                case '!S-1':
                        client.sendText(from, 'Connection Status = Active')
                    break
                case 'El Psy Congroo':
                        client.sendFileFromUrl(from, 'https://i.ibb.co/s9Rw8hN/index.jpg','Steins;Gate.jpg','El Psy Congroo')
                    break
                case '!Do you love me':
                        client.sendText(from, 'U-Uh... n-no! *blushes* O-Of course not, idiot!')
                    break
                case 'Assalamualaikum' :
                        client.sendText(from, 'Waalaikumsalam Warahmatullahi Wabarakatuh')
                    break
                case 'Join':
                        client.sendText(from, '*Otewe Gannn*')
                    break
                case 'Never gonna':
                        client.sendText(from, 'give you up')
                    break
                case 'never gonna':
                        client.sendText(from, 'Let you down')
                    break
                case 'Never gonna run around':
                        client.sendText(from, 'and dessert you')
                    break 
                case 'Waifu':
                case '#waifu': 
                        q8 = q2 = Math.floor(Math.random() * 98) + 10;
                        client.sendFileFromUrl(from, 'http://randomwaifu.altervista.org/images/00'+q8+'.png', 'Waifu.png', 'How is she?')
                    break
                case 'Heave ho':
                case 'Heave ho!':
                        client.sendFileFromUrl(from, 'https://i.ibb.co/KjJx5ps/Whats-App-Image-2020-08-01-at-16-36-10.jpg','Soran.jpg','*Soran Soran*')
                    break
                case 'Neko':          
                        q2 = Math.floor(Math.random() * 900) + 300;
                        q3 = Math.floor(Math.random() * 900) + 300;
                        client.sendFileFromUrl(from, 'http://placekitten.com/'+q3+'/'+q2, 'neko.png','Neko ')
                    break
                 case 'Pokemon':
                        q7 = Math.floor(Math.random() * 890) + 1;
                        client.sendFileFromUrl(from, 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/'+q7+'.png','Pokemon.png',)
                    break
                case 'Wallpaper' :
                       q4 = Math.floor(Math.random() * 800) + 100;
                       client.sendFileFromUrl(from, 'https://wallpaperaccess.com/download/anime-'+q4,'Anime.png','Here is your wallpaper')
                    break
                case 'Tsundere' :
                case 'tsundere' : 
                        client.sendText(from, 'I am not a tsundere, baka!')       
                    break
		case 'Quotes' :
		case 'quotes' :
		case 'Quote' :
			fetch('https://api.quotable.io/random', {
			method: 'GET'
			})
			.then(res => res.text())
			.then(json => {
			var njay = json
			quotedd = JSON.parse(njay)
			client.reply(from, `Quote request by *${pushname}*\n\nTags : ${quotedd.tags}\nAuthor : ${quotedd.author}\n\n*${quotedd.content}*`, message)
			})
		    break
		case 'Meme':
			const response = await axios.get('https://meme-api.herokuapp.com/gimme/wholesomeanimemes');
			const { postlink, title, subreddit, url, nsfw, spoiler } = response.data
			await client.sendFileFromUrl(from, `${url}`, 'meme.jpg', `${title}`)
		    break
		case 'Toxic':
			const toxidd = ['babi', 'monyet', 'anjing', 'dino', 'jembut',
			'memek', 'kontol', 'tempik', 'bool', 'gay', 'lesbi', 'mpshh',
			'sempak', 'cangcut', 'bagong', 'torpedo', 'bangsat', 'maling',
			'copet'
			]
			const randToxic = toxidd[Math.floor(Math.random() * toxidd.length)]
			const err = [`muka lo kek ${randToxic}`, `anda tau ${randToxic} ?`,`${randToxic} Lo ${randToxic}`,
			`ngapa ${randToxic} ga seneng?`,`ribut sini lo ${randToxic}`,`jangan ngakak lo ${randToxic}`,
			`wey ${randToxic}!!`,`aku sih owh aja ya ${randToxic}`,`ga seneng send lokasi lo ${randToxic}`,
			`capek w ${randToxic}`, `hari ini kau minat gelut ${toxidd[2]} ?`,
			`w ganteng dan lo kek ${randToxic}`,`bucin lo ${randToxic}`,`najis baperan kek ${randToxic}`,
			`nge-teh ${randToxic}`,`gaya lo sok iye, mukalo kek ${randToxic}`,`${randToxic} awokwowkok`
			]
			const errAcak = err[Math.floor(Math.random() * err.lenght)]
			client.sendText(from, `${errAcak}`)
		    break
                case 'Mystery Video':
                        client.sendText(from, 'https://youtu.be/dQw4w9WgXcQ')
		    break
                case 'Fitur lain' :
                        client.sendText(from, '*Fitur Lain* : \n1. Quotemaker: Untuk Membuat Quotes. \n2. Meme: Untuk Generator Random Meme. \n3. Mysteri Video: Video Misteri \n4. Assalamualaikum: Untuk Salam \n4. dfb *spasi URL* : Untuk Mendownload Video Dari Facebook. \n5. ytmp3 *spasi URL* : Untuk Convert Video dari Youtube Menjadi Mp3* \n6. Kontak: Kontak Owner. \n7. Support: Untuk Support Server Bot Agar Terus Berjalan. \n8. Grup bot: Untuk Join Ke Grup Bot \n *Fitur Lainnya Menyusul* \n *Copyright © 2020 Powered by Dandi.*')
                    break
                case 'dfb':
                    if (args.length >=2) {
                        const urlvid = args[1]
                        const high = await fbvid.high(urlvid)
                        const low = await fbvid.low(urlvid)
                        if (high == "Either the video is deleted or it's not shared publicly!") {
                            client.sendFileFromUrl(from, low.url, "video.mp4", "SD Video successfully downloaded")
                        } else if (high !== "Either the video is deleted or it's not shared publicly!") {
                            client.sendFileFromUrl(from, high.url, "video.mp4", "HD Video successfully downloaded")
                        } else if (high == "Either the video is deleted or it's not shared publicly!" && low == "Either the video is deleted or it's not shared publicly!") {
                            client.reply(from,"The URL is invalid",message)
                        }
                    } else {
                        client.reply(from,"The format is !fb [URL Video]",message)
                    }
                    break
		case 'Menu':
                        client.sendText(from, `Hai *${pushname}*\n\nPerintah\n\nStiker/stiker \nMengubah gambar ke stiker\n\nNeko\nMengirim gambar kucing acak\n\nPokemon Mengirim gambar pokemon acak(beta) \n \nWallpaper \nMengirim wallpaper acak (beta)\n\nSeasonal anime \nMenampilkan daftar anime musiman\n\nInfo \nMenampilkan syarat dan ketentuan\n\nQuote\nMengirim quotedd\n\nWaifu\nMengirim gambar anime acak \nFitur lain\nUnuk melihat fitur lainnya \n\nLinkGrup\nMengambil tautan undangan grup, [ Fitur hanya untuk bot admin ]\n\nRevLinkGrup\nMencabut tautan undangan saat ini, [ Fitur Hanya untukbot admin ]\n\nJoin https://chat.whatsapp.com/blablabla\nUntuk menambahkan bot ke grup anda\n\nLirik aku-bukan-boneka\nMenampilkan lirik lagu aku bukan boneka(contoh)\n\nytmp3 https://youtu.be/6l5V3BWDcMw\nMendownload mp3 dari YouTube\n\n[ Owner Only/Admin ]\n\nAdd 628xxxx\nUntuk menambahkan anggota grup\n\nKick 628xxx\nUntuk mengeluarkan member grup\n\nPromote 628xxx\nMenaikkan pangkat member menjadi admin\n\nDemote 628xxx\nMenurunkan pangkat admin menjadi member`)
                    break
		case 'Seasonal anime':
                        client.sendText(from, 'Summer 2020 \n Re:Zero kara Hajimeru Isekai Seikatsu 2nd Season \n Yahari Ore no Seishun Love Comedy wa Machigatteiru. Kan \n The God of High School \n Sword Art Online: Alicization - War of Underworld 2nd Season \n Enen no Shouboutai: Ni no Shou \n Maou Gakuin no Futekigousha: Shijou Saikyou no Maou no Shiso, Tensei shite Shison-tachi no Gakkou e \n Kanojo, Okarishimasu \n Deca-Dence \n Uzaki-chan wa Asobitai! \n Monster Musume no Oishasan')
		    break
                case 'Thank you':
                        client.sendText(from, 'Whatever... *smiles*') 
                    break
                case 'Info':
                        client.sendText(from, 'Ini adalah program sumber terbuka yang ditulis dalam Javascript. \n \nDengan menggunakan bot, Anda menyetujui Syarat dan Ketentuan kami \n \nSyarat dan ketentuan \n \nTeks dan nama pengguna whatsapp Anda akan disimpan di server kami selama bot aktif (Tolong Sopan), data Anda akan dihapus ketika  bot menjadi offline.  Kami TIDAK menyimpan gambar, video, file audio dan dokumen yang Anda kirim.  Kami tidak akan pernah meminta Anda untuk mendaftar atau meminta kata sandi, OTP, atau PIN Anda.  \n \n Terima kasih, Selamat bersenang-senang! \n *Created By Dandi*')    
                     }
        } else {
            if (!isGroupMsg) console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname))
            if (isGroupMsg) console.log('[RECV]', color(time, 'yellow'), 'Message from', color(pushname), 'in', color(name))
        }
    } catch (err) {
        console.log(color('[ERROR]', 'red'), err)
    }
}

process.on('Something went wrong', function (err) {
    console.log('Caught exception: ', err);
  });

function color (text, color) {
  switch (color) {
    case 'red': return '\x1b[31m' + text + '\x1b[0m'
    case 'yellow': return '\x1b[33m' + text + '\x1b[0m'
    default: return '\x1b[32m' + text + '\x1b[0m' // default is green
  }
}

startServer()
