const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const db = require('quick.db');
const useful = require('useful-tools');
client.ayar = db;

client.htmll = require('cheerio');
client.useful = useful;
client.tags = require('html-tags');

let profil = JSON.parse(fs.readFileSync('./profil.json', 'utf8'))
client.profil = profil

client.ayarlar = {
  "prefix": "!", //prefix
  "oauthSecret": "Qx6u6q11s82BlsP0Z2VvOuvFl5oDkUox", //bot secreti
	"callbackURL": "https://astariuslist.gq/callback", //benim sitenin urlsini kendin ile değiş "/callback" kalacak!
	"kayıt": "754410274005712937", //onaylandı, reddedildi, başvuru yapıldı falan kayıtların gideceği kanalın ID'ini yazacaksın
  "vote": "754410274479538338",
  "renk": "RANDOM",
  "rapor": "754410275108552713"
};


client.yetkililer = ['714451348212678658','478874404177051648'] //tüm yetkililerin ıdleri gelcek array
client.webyetkililer = ['714451348212678658','478874404177051648'] //web yetkililerin ıdleri gelcek array
client.sunucuyetkililer = ['714451348212678658','478874404177051648'] //sunucu yetkililerin ıdleri gelcek array

//["id", "id2"]

client.on('ready', async () => {
   client.appInfo = await client.fetchApplication();
  setInterval( async () => {
    client.appInfo = await client.fetchApplication();
  }, 60000);
  
   require("./app.js")(client);
  
  client.user.setActivity(`Astarius Family`, { type:"WATCHING" })
  client.channels.get("755990150210781284").send("<:6951_Online:743073910320529481> **Astarius Bot List** is online")
  console.log("Aktif!")
});

setInterval(() => {

	if (db.has('botlar') && db.has('kbotlar')) {

for (var i = 0; i < Object.keys(db.fetch('kbotlar')).length; i++) {
for (var x = 0; x < Object.keys(db.fetch('botlar')).length; x++) {
var bot = Object.keys(db.fetch('botlar'))[x]
var user = Object.keys(db.fetch('kbotlar'))[i]
if (db.has(`oylar.${bot}.${user}`)) {
   setTimeout(() => {
        db.delete(`oylar.${bot}.${user}`)
    }, require('ms')(`${client.useful.seg(db.fetch(`oylar.${bot}.${user}`), 6)}h`));
}
}
}

	}

}, 10000);


const chalk = require('chalk')

client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
fs.readdir(`./komutlar/`, (err, files) => {
	let jsfiles = files.filter(f => f.split(".").pop() === "js")

	if(jsfiles.length <= 0) {
		console.log("Olamazz! Hiç komut dosyası bulamadım!")
	} else {
		if (err) {
			console.error("Hata! Bir komutun name veya aliases kısmı yok!")
		}
		console.log(`${jsfiles.length} komut yüklenecek.`)

		jsfiles.forEach(f => {
			let props = require(`./komutlar/${f}`)
			client.commands.set(props.help.name, props)
			props.conf.aliases.forEach(alias => {
				client.aliases.set(alias, props.help.name)
			})
			console.log(`Yüklenen komut: ${props.help.name}`)
		})
	}
});

client.on("message", async message => {

	if (message.author.bot) return
	if (!message.content.startsWith('-')) return
	var command = message.content.split(' ')[0].slice('-'.length)
	var args = message.content.split(' ').slice(1)
	var cmd = ''

	if (client.commands.has(command)) {
		var cmd = client.commands.get(command)
	} else if (client.aliases.has(command)) {
		var cmd = client.commands.get(client.aliases.get(command))
	}

	if (cmd) {
    if (cmd.conf.permLevel === 'ozel') { 
      if (client.yetkililer.includes(message.author.id) === false) {
        const embed = new Discord.RichEmbed()
					.setDescription(`Kardeşim sen WebSite yetkilisi değilsin saçma saçma işlerle uğraşma!`)
					.setColor(client.ayarlar.renk)
					.setTimestamp()
				message.channel.send("Yetersiz Yetki.")
				return
      }
    }
    
		if (cmd.conf.permLevel === 1) {
			if (!message.member.hasPermission("MANAGE_MESSAGES")) {
				const embed = new Discord.RichEmbed()
					.setDescription(`Sen önce mesajları yönetmeyi öğren sonra bu komutu kullanırsın.`)
					.setColor(client.ayarlar.renk)
					.setTimestamp()
				message.channel.send("Yetersiz yetki.")
				return
			}
		}
		if (cmd.conf.permLevel === 2) {
			if (!message.member.hasPermission("KICK_MEMBERS")) {
				const embed = new Discord.RichEmbed()
					.setDescription(`Üyeleri atma yetkin yok.`)
					.setColor(client.ayarlar.renk)
					.setTimestamp()
				message.channel.send("Üyeleri atma yetkin yok.")
				return
			}
		}
		if (cmd.conf.permLevel === 3) {
			if (!message.member.hasPermission("ADMINISTRATOR")) {
				const embed = new Discord.RichEmbed()
					.setDescription(`Yetersiz yetki.`)
					.setColor(client.ayarlar.renk)
					.setTimestamp()
				message.channel.send("Yetersiz yetki.")
				return
			}
		}
		if (cmd.conf.permLevel === 4) {
			const x = await client.fetchApplication()
      var arr = [x.owner.id, '276829048943149057','348097494548348940','315218945693188098']
			if (!arr.includes(message.author.id)) {
				const embed = new Discord.RichEmbed()
					.setDescription(`Yetkin yetersiz.`)
					.setColor(client.ayarlar.renk)
					.setTimestamp()
				message.channel.send("Yetersiz yetki.")
				return
			}
		}
		if (cmd.conf.enabled === false) {
			const embed = new Discord.RichEmbed()
				.setDescription(`Bu komut devre dışı.`)
				.setColor(client.ayarlar.renk)
				.setTimestamp()
			message.channel.send("Bu komut devre dışı.")
			return
		}
		if(message.channel.type === "dm") {
			if (cmd.conf.guildOnly === true) {
				const embed = new Discord.RichEmbed()
					.setDescription(`Bu komutu özel mesajlarda kullanamazsın.`)
					.setColor(client.ayarlar.renk)
					.setTimestamp()
				message.channel.send("Bu komutu özel mesajlarda kullanamazsın.")
				return
			}
		}
		cmd.run(client, message, args)
	}
});


client.login("NzUzNzU1NzQ2OTEwNDcwMTk2.X1qzvg.ExUrY67Ey-AV1mg0KvDDIgz-qvk") //tokeni yaz işte

process.env = {}
process.env.TOKEN = "NzUzNzU1NzQ2OTEwNDcwMTk2.X1qzvg.ExUrY67Ey-AV1mg0KvDDIgz-qvk";
client.on("ready", () => {
  client.channels.get("755500819092340917").join();
   //main dosyaya atılacak
})



