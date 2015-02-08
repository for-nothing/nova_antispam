function conmsg(msg){
	if (console)
	console.log(msg);
}

function local_file(){
	return Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
}
function input_stream() {
	return Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
}
function rep_err(novaPanel){
	var strbundle = document.getElementById("novastrings");
	novaPanel.label = "Nova: " + request_posts.length + strbundle.getString("msg_letters_pay") + deleted + strbundle.getString("msg_letters_del") + paid_posts.length + strbundle.getString("msg_paid");
}
window.addEventListener("load",function(){
	var novaPanel = document.getElementById("nova-panel");
	novaPanel.minWidth=200;
novaPanel.label = "start";
	get_save();
//novaPanel.label = "get_save();";
	conmsg("nova_antispam load in progress...");
	check_nova(novaPanel);
//novaPanel.label = "check_nova(novaPanel);";
	check_conf(novaPanel);
//novaPanel.label = "check_conf(novaPanel);";
	check_user();
//novaPanel.label = "check_user();";
	check_mail(novaPanel);
//novaPanel.label = "check_mail(novaPanel);";
	window.setInterval(function(){
		check_mail(nova_panel());
	}, 60000);
}, false);

var global_error = 0;
var user_attr = { };
user_attr.rpcuser = "";
user_attr.rpcpassword = "";
user_attr.rpcallowip = "";
user_attr.rpcport = "8344";
user_attr.address = "";
var save_ch = " ";
var paid_posts = [];
var request_posts = [];
var deleted = 0;
var white_list = [];
var price = 0.1;
var paid_txid = [];
var sync_ch = "true";
var enbl_accnts = [];

function nova_panel(){
return document.getElementById("nova-panel");
}

function file_in(file){
	var istream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
	istream.init(file, 0x01, 00660, null);
	var mInputStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
	mInputStream.init(istream);
	var save_str = mInputStream.read(mInputStream.available());
	istream.close();
	mInputStream.close();
	return save_str;
}

function simple_file_out(file,what_to_do,save_str){
	var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
	foStream.init(file, what_to_do, 0660, 0);
	foStream.write(save_str, save_str.length);
	foStream.close();
}

function get_save(){
	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
	var prof = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
	if(prof.path.match("/")){
		var slash = "/";
	}
	else{
		var slash = "\\";
	}
	file.initWithPath(prof.path + slash + "flag_save013.txt");
	if(file.exists()){
		var save_str = file_in(file);
		save_ch = save_str.match(/false|true/g)[0];
		var check_line = document.getElementById("removeUnpaidPosts");
		check_line.setAttribute("checked", save_ch);
		sync_ch = save_str.match(/false|true/g)[1];
		var sync_book = document.getElementById("syncAddrBook");
		sync_book.setAttribute("checked", sync_ch);
		var check__line = document.getElementById("remove_unpaidPosts");
		if(check__line){
			check__line.setAttribute("checked", save_ch);
			var sync__book = document.getElementById("sync_AddrBook");
			sync__book.setAttribute("checked", sync_ch);
		}
	}
	else{
		save_ch = "false";
		sync_ch = "true";
		var sync_book = document.getElementById("syncAddrBook");
		sync_book.setAttribute("checked", sync_ch);
		var sync__book = document.getElementById("sync_AddrBook");
		if(sync__book){
			sync__book.setAttribute("checked", sync_ch);
			var check__line = document.getElementById("remove_unpaidPosts");
			check__line.setAttribute("checked", save_ch);
		}
		var check_line = document.getElementById("removeUnpaidPosts");
		check_line.setAttribute("checked", save_ch);
		var save_str = "removeUnpaidPosts=false\r\nsyncAddrBook=true\r\n";
		simple_file_out(file,0x02 | 0x08 | 0x20,save_str);
	}
	file.initWithPath(prof.path + slash + "txid_save.txt");
	if(file.exists()){
		var save_str = file_in(file);
		if(save_str.match(/[0-9a-z]{64}/g)){
			paid_txid = save_str.match(/[0-9a-z]{64}/g);
		}
	}
	file.initWithPath(prof.path + slash + "posts_save.txt");
	if(file.exists()){
		var save_str = file_in(file);
		if(save_str.match(/\w.*\w/gm)){
			paid_posts = save_str.match(/\w.*\w/gm);
		}
	}
}

function check_nova(novaPanel){
	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
	var home = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("Home", Components.interfaces.nsIFile);
	if(home.path.match("/")){
		var nova = "/.novacoin";
	}
	else{
		var nova = "\\AppData\\Roaming\\NovaCoin\\";
	}
	file.initWithPath(home.path + nova);
	if(!file.exists()){
		var strbundle = document.getElementById("novastrings");
		global_error = 1;
		var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
		var result = prompts.confirm(null, strbundle.getString("title_not_found"), strbundle.getString("err_client_not_found"));
		if(result){
			var ww = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService(Components.interfaces.nsIWindowWatcher);
			var win = ww.openWindow(null, "http://sourceforge.net/projects/novacoin/files/latest/download?source=files","aboutNovacoin", "chrome,centerscreen", null);
			novaPanel.label = strbundle.getString("msg_after_install");
		}
		else{
			novaPanel.label = "Nova: " + global_error + strbundle.getString("err_dir_not_found");
		}
	}
}

function check_conf(novaPanel){
	if(!global_error){
		var file = local_file();
		var home = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("Home", Components.interfaces.nsIFile);
		if(home.path.match("/")){
			var nova = "/.novacoin/novacoin.conf";
		}
		else{
			var nova = "\\AppData\\Roaming\\NovaCoin\\novacoin.conf";
		}
		file.initWithPath(home.path + nova);
		if(!file.exists()){
			var strbundle = document.getElementById("novastrings");
			global_error = 2;
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
			var result = prompts.confirm(null, strbundle.getString("title_conf_not_found"), strbundle.getString("err_conf_not_found"));
			if(result){
				var conf = "server=1\r\nrpcuser=";
				var abc = "qwertyuioplkjhgfdsazxcvbnmMNBVCXZASDFGHJKLPOIUYTREWQ0123654789";
				var user = "";
				while(user.length < 8){
					user = user + abc.charAt(Math.round(Math.random() * (abc.length -1)));
				}
				conf = conf + user + "\r\nrpcpassword=";
				var pass = "";
				while(pass.length < 8){
					pass = pass + abc.charAt(Math.round(Math.random() * (abc.length -1)));
				}
				conf = conf + pass + "\r\nrpcallowip=127.0.0.1\r\nrpcport=8344";
				simple_file_out(file,0x02 | 0x08 | 0x20,conf);
				novaPanel.label = strbundle.getString("msg_conf_created");
			}
			else{
				novaPanel.label = strbundle.getString("status_no_conf");
			}
		}
	}
}

function check_user(){
	if(!global_error){
		var file = local_file();
		var home = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("Home", Components.interfaces.nsIFile);
		if(home.path.match("/")){
			var slash = "/";
			var nova = "/.novacoin/novacoin.conf";
		}
		else{
			var slash = "\\";
			var nova = "\\AppData\\Roaming\\NovaCoin\\novacoin.conf";
		}
		file.initWithPath(home.path + nova);
		var conf = file_in(file);
		user_attr.rpcuser = conf.match(/^rpcuser.*\w/gm)[0].slice(8);
		user_attr.rpcpassword = conf.match(/^rpcpassword.*\w/gm)[0].slice(12);
		user_attr.rpcallowip = conf.match(/^rpcallowip.*\w/gm)[0].slice(11);
		var v = conf.match(/^rpcport.*\w/gm)[0].slice(8);
		if (v) user_attr.rpcport = v;
		var prof = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
		file.initWithPath(prof.path + slash + "accnts_save.txt");
		if(file.exists()){
			var save_str = file_in(file);
			if(save_str.match(/^[()'"а-яА-Яa-z0-9A-Z.!#$%&*+-/=?^_`{}|~ ]*@[() а-яА-Яa-z0-9A-Z-_.:]*/gm)){
				enbl_accnts = save_str.match(/^[()'"а-яА-Яa-z0-9A-Z.!#$%&*+-/=?^_`{}|~ ]*@[() а-яА-Яa-z0-9A-Z-_.:]*/gm);
			}
		}
		else{
			var save_str = "write to the following address of the account you want to use\r\n";
			simple_file_out(file,0x02 | 0x08 | 0x20,save_str);
		}
		var file_name = prof.path + slash + "user_save.txt";
		file.initWithPath(file_name);
		if(file.exists()){
			var save_str = file_in(file);
			if(save_str.match(/^price=\d/gm)){
				price = parseFloat(save_str.match(/^price=.*\w/gm)[0].slice(6).replace(",","."));
			}
			if(save_str.match(/^[()'"а-яА-Яa-z0-9A-Z.!#$%&*+-/=?^_`{}|~ ]*@[() а-яА-Яa-z0-9A-Z-_.:]*/gm)){
				white_list = save_str.match(/^[()'"а-яА-Яa-z0-9A-Z.!#$%&*+-/=?^_`{}|~ ]*@[() а-яА-Яa-z0-9A-Z-_.:]*/gm);
			}
			if(save_str.match(/addres+=4[a-z0-9A-Z]{33}/)){
				user_attr.address = save_str.match(/4[a-z0-9A-Z]{33}/)[0];
				global_error = 3;
			}
			else{
				var req = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
				req.open('POST', "http://" + user_attr.rpcuser + ":" + user_attr.rpcpassword + "@" + user_attr.rpcallowip + ":" + user_attr.rpcport + "/",false);
				req.setRequestHeader('Content-Type', 'text/plain');
				req.send('{ \"method\": \"getaccountaddress\", \"params\": ["' + user_attr.rpcuser + '"]}');
				if(req.readyState == 4){
					user_attr.address = JSON.parse(req.responseText).result;
					global_error = 3;
				}
			}
		}
		else{
			var save_str = "address=write_there_your_novacoin_address \r\n\r\nprice=write_here_instead_your_price \r\n\r\nwrite below the allowable email addresses \r\n";
			simple_file_out(file,0x02 | 0x08 | 0x20,save_str);
			var req = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
			req.open('POST', "http://" + user_attr.rpcuser + ":" + user_attr.rpcpassword + "@" + user_attr.rpcallowip + ":" + user_attr.rpcport + "/",false);
			req.setRequestHeader('Content-Type', 'text/plain');
			req.send('{ \"method\": \"getaccountaddress\", \"params\": ["' + user_attr.rpcuser + '"]}');
			if(req.readyState == 4){
				user_attr.address = JSON.parse(req.responseText).result;
				global_error = 3;
			}
		}
	}
}

ms_hr = { };
var msg_num = 0;
var array_msg = [];
var tranz = { };
var txid = "";
var msg_num = 0;
var nova_inbox = { };
var nova_trash = { };
var acc_num = 0;
var nova_acc = { };
var nova_ident = { };
var start_fold = { };


function request_payment(do_it){
	var cf = Components.classes["@mozilla.org/messengercompose/composefields;1"].createInstance(Components.interfaces.nsIMsgCompFields);
	cf.from = (ms_hr.mime2DecodedRecipients + "<" + ms_hr.recipients).match(/[()'"а-яА-Яa-z0-9A-Z.!#$%&*+-/=?^_`{}|~ ]*@[() а-яА-Яa-z0-9A-Z-_.:]*/)[0];
	cf.subject = ms_hr.mime2DecodedSubject;
	cf.to = (ms_hr.mime2DecodedAuthor + "<" + ms_hr.author).match(/[()"'а-яА-Яa-z0-9A-Z.!#$%&*+-/=?^_`{}|~ ]*@[() а-яА-Яa-z0-9A-Z-_.:]*/)[0];
	cf.body = do_it;
	var params = Components.classes["@mozilla.org/messengercompose/composeparams;1"].createInstance(Components.interfaces.nsIMsgComposeParams);
	params.composeFields = cf;
	var msgSend = Components.classes["@mozilla.org/messengercompose/send;1"].createInstance(Components.interfaces.nsIMsgSend);
	var msgCompose = Components.classes["@mozilla.org/messengercompose/compose;1"].createInstance(Components.interfaces.nsIMsgCompose);
	msgCompose.compFields = cf;
	msgCompose.initialize(params,null);
	msgCompose.SendMsg(msgSend.nsMsgDeliverNow,nova_ident, nova_acc.key, null, null);
	request_posts.push(ms_hr.messageId);
	msg_num++;
	window.setTimeout(function () {
		start_msg(nova_panel());
	},140);
}

function process_account(){
	var acctMgr = Components.classes["@mozilla.org/messenger/account-manager;1"].getService(Components.interfaces.nsIMsgAccountManager);
	var accounts = acctMgr.accounts;
	if(acc_num < accounts.length){
		msg_num = 0;
		nova_acc = accounts.queryElementAt(acc_num, Components.interfaces.nsIMsgAccount);
		if(enbl_accnts.indexOf(nova_acc.incomingServer.prettyName) != -1){
			var identities = acctMgr.allIdentities;
			var has_ident = false;
			for(var i = 0;i < identities.length;i++){
				var identity = identities.queryElementAt(i,Components.interfaces.nsIMsgIdentity);
				if(identity.email == nova_acc.incomingServer.prettyName){
					nova_ident = identity;
					has_ident = true;
					break;
				}
			}
			if(has_ident){
				var rootFolder = nova_acc.incomingServer.rootFolder;
				var has_inbox = 0;
				var has_trash = 0;
				if (rootFolder.hasSubFolders){
					var subFolders = rootFolder.subFolders;
					while(subFolders.hasMoreElements()){
						var folder = subFolders.getNext().QueryInterface(Components.interfaces.nsIMsgFolder);
						if(folder.name.match(/inbox|входящие/i)){
							nova_inbox = folder;
							has_inbox = 1;
						}
						if(folder.name.match(/trash|корзина|удал[ёе]нные/i)){
							nova_trash = folder;
							has_trash = 1;
						}
						if(has_trash + has_inbox == 2){
							break;
						}
						if(folder.hasSubFolders){
							var gm = folder.subFolders;
							while(gm.hasMoreElements()){
								var s_f = gm.getNext().QueryInterface(Components.interfaces.nsIMsgFolder);
								if(s_f.name.match(/inbox|входящие/i)){
									nova_inbox = s_f;
									has_inbox = 1;
								}
								if(s_f.name.match(/trash|корзина|удал[её]нные/i)){
									nova_trash = s_f;
									has_trash = 1;
								}
							}
						}
					}
				}
				if(has_trash + has_inbox == 2){
					var entries = nova_inbox.messages;
					array_msg = [];
					if(sync_ch == "false"){
						while(entries.hasMoreElements()){
							var entry = entries.getNext();
							entry.QueryInterface(Components.interfaces.nsIMsgDBHdr);
							var e_ml = (entry.mime2DecodedAuthor + "<" + entry.author).match(/[()'"а-яА-Яa-z0-9A-Z.!#$%&*+-/=?^_`{}|~ ]*@[() а-яА-Яa-z0-9A-Z-_.:]*/)[0];
							if((paid_posts.indexOf(entry.messageId) == -1) && (request_posts.indexOf(entry.messageId) == -1) && (white_list.indexOf(e_ml) == -1)){
								array_msg.push(entry);
							}
						}
					}
					else{
						let abManager = Components.classes["@mozilla.org/abmanager;1"].getService(Components.interfaces.nsIAbManager);
						let allAddressBooks = abManager.directories;
						let collection = allAddressBooks.getNext().QueryInterface(Components.interfaces.nsIAbCollection);
						while(entries.hasMoreElements()){
							var entry = entries.getNext();
							entry.QueryInterface(Components.interfaces.nsIMsgDBHdr);
							var e_ml = (entry.mime2DecodedAuthor + "<" + entry.author).match(/[()"'а-яА-Яa-z0-9A-Z.!#$%&*+-/=?^_`{}|~ ]*@[() а-яА-Яa-z0-9A-Z-_.:]*/)[0];
							let card = collection.cardForEmailAddress(e_ml);
							if(!card){
								if((paid_posts.indexOf(entry.messageId) == -1) && (request_posts.indexOf(entry.messageId) == -1) && (white_list.indexOf(e_ml) == -1)){
									array_msg.push(entry);
								}
							}
						}
					}
					
					window.setTimeout(function () {
						start_msg(nova_panel());
					},10);
				}
			}
		}
		else{
			acc_num++;
			window.setTimeout(function () {
				process_account();
			},10);
		}
	}
	else{
		if(start_fold){
			gFolderTreeView.selectFolder(start_fold);
		}
		window.setTimeout(function () {
			rep_err(nova_panel());
		},60);
	}
}

function start_msg(novaPanel){
	if(msg_num < array_msg.length){
		gFolderTreeView.selectFolder(nova_inbox);
		ms_hr = array_msg[msg_num];
		var uri_m = nova_inbox.getUriForMsg(ms_hr);
		let messenger = Components.classes["@mozilla.org/messenger;1"].createInstance(Components.interfaces.nsIMessenger);
		let listener = Components.classes["@mozilla.org/network/sync-stream-listener;1"].createInstance(Components.interfaces.nsISyncStreamListener);
		messenger.messageServiceFromURI(uri_m).streamMessage(uri_m, listener, null, null, false, "");
		var mssg = nova_inbox.getMsgTextFromStream(listener.inputStream,ms_hr.Charset,ms_hr.messageSize,ms_hr.messageSize,false,true,{ });
		listener.close();
		var strbundle = document.getElementById("novastrings");
		if(mssg.match(/[0-9a-z]{64}/)){
			novaPanel.label = strbundle.getString("err_client_not_run") + "(start_msg)";
			txid = mssg.match(/[0-9a-z]{64}/)[0];
			var req = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
			req.open('POST', "http://" + user_attr.rpcuser + ":" + user_attr.rpcpassword + "@" + user_attr.rpcallowip + ":" + user_attr.rpcport + "/", false);
			req.setRequestHeader('Content-Type', 'text/plain');
			req.send('{ \"method\": \"gettransaction\", \"params\": ["' + txid + '"]}');
			if(req.readyState == 4){
				tranz = JSON.parse(req.responseText);
				window.setTimeout(function () {
					process_message();
				},10);
			}
			else{
				window.setTimeout(function () {
					start_msg(nova_panel());
				},30);
			}
		}
		else{
			request_payment( strbundle.getString("rpl_body_1") + ms_hr.messageId + "> " + ms_hr.mime2DecodedSubject + strbundle.getString("rpl_body_1a") + price + strbundle.getString("rpl_body_2") + user_attr.address + strbundle.getString("rpl_body_3"));
			if(save_ch == "true"){
				window.setTimeout(function () {
					gFolderDisplay.selectMessage(ms_hr);
					MsgMoveMessage(nova_trash);
					deleted++;
				},70);
			}
		}
	}
	else{
		acc_num++;
		window.setTimeout(function () {
			process_account();
		},10);
	}
}

function process_message(){
	var strbundle = document.getElementById("novastrings");
	if(tranz.error && (tranz.error.code == -5)){
		request_payment( strbundle.getString("err_incorrect_txid") + ms_hr.messageId + "> " + ms_hr.mime2DecodedSubject + strbundle.getString("err_incorrect_txid1"));
		if(save_ch == "true"){
			window.setTimeout(function () {
				gFolderDisplay.selectMessage(ms_hr);
				MsgMoveMessage(nova_trash);
				deleted++;
			},70);
		}
	}
	else if(tranz.result.details[0].address != user_attr.address){
		request_payment( strbundle.getString("err_wrong_target") + ms_hr.messageId + "> " + ms_hr.mime2DecodedSubject + strbundle.getString("err_wrong_target1") + price + strbundle.getString("rpl_body_2s") + user_attr.address + strbundle.getString("rpl_body_3"));
		if(save_ch == "true"){
			window.setTimeout(function () {
				gFolderDisplay.selectMessage(ms_hr);
				MsgMoveMessage(nova_trash);
				deleted++;
			},70);
		}
	}
	else if(tranz.result.amount < price){
		request_payment( strbundle.getString("msg_u_send_to") + user_attr.address + strbundle.getString("msg_bellow") + price + " NVC" + strbundle.getString("rpl_body_1") + ms_hr.messageId + "> " + ms_hr.mime2DecodedSubject + strbundle.getString("rpl_body_1a") + price + strbundle.getString("rpl_body_2d") + strbundle.getString("rpl_body_3"));
		if(save_ch == "true"){
			window.setTimeout(function () {
				gFolderDisplay.selectMessage(ms_hr);
				MsgMoveMessage(nova_trash);
				deleted++;
			},70);
		}
	}
	else if(tranz.result.vout[0].value == 0){	
		request_payment( strbundle.getString("err_no_comission") + strbundle.getString("rpl_body_1") + ms_hr.messageId + "> " + ms_hr.mime2DecodedSubject + strbundle.getString("rpl_body_1a") + price + strbundle.getString("rpl_body_2") + user_attr.address + strbundle.getString("rpl_body_3"));
		if(save_ch == "true"){
			window.setTimeout(function () {
				gFolderDisplay.selectMessage(ms_hr);
				MsgMoveMessage(nova_trash);
				deleted++;
			},70);
		}
	}
	else if(paid_txid.indexOf(txid) != -1){
		request_payment( strbundle.getString("err_double_use") + txid + ". " + strbundle.getString("rpl_body_1") + ms_hr.messageId + "> " + ms_hr.mime2DecodedSubject + strbundle.getString("rpl_body_1a") + price + strbundle.getString("rpl_body_2") + user_attr.address + strbundle.getString("rpl_body_3"));
		if(save_ch == "true"){
			window.setTimeout(function () {
				gFolderDisplay.selectMessage(ms_hr);
				MsgMoveMessage(nova_trash);
				deleted++;
			},70);
		}
	}
	else{
		paid_posts.push(ms_hr.messageId);
		paid_txid.push(txid);
		msg_num++;
		window.setTimeout(function () {
			start_msg(nova_panel());
		},10);
	}
}

function check_mail(novaPanel){
	var strbundle = document.getElementById("novastrings");
	if(global_error == 3){
		acc_num = 0;
		if(enbl_accnts.length != 0){
			start_fold = gFolderDisplay.displayedFolder;
			process_account();
		}
		else{
			novaPanel.label = strbundle.getString("no_selected_accounts");
		}
	}
	else if(global_error == 0){
		novaPanel.label = strbundle.getString("err_client_not_run") + "(check_mail)";
	}
}
