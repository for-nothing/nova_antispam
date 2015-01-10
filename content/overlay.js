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
	novaPanel.label = "Nova: " + request_posts.length + " " + msg_letters_pay + ", " + deleted + msg_letters_del + ", " + paid_posts.length + " " + msg_paid;
}

window.addEventListener("load",function(){ 
	var novaPanel = document.getElementById("nova-panel");
  novaPanel.minWidth=200;
	novaPanel.label = msg_status_alive;  
	get_save();
	novaPanel.label = "Nova: get_save";
	var check_line = document.getElementById("removeUnpaidPosts");
	check_line.addEventListener("click",function(){
		save_check("remove_unpaidPosts");
		check_mail(novaPanel);
	},false);
	novaPanel.label = "Nova: check_line register";
	var check__line = document.getElementById("remove_unpaidPosts");
	check__line.addEventListener("click",function(){
		save_check("removeUnpaidPosts");
		check_mail(novaPanel);
	},false);
 
  conmsg("nova_antispam load in progress..."); 
	novaPanel.label = "Nova: check__line register";
	check_nova(novaPanel);
	novaPanel.label = "Nova: check_nova";
	check_conf(novaPanel);
	novaPanel.label = err_client_not_run + "(load)"; 
	check_user(novaPanel);
	novaPanel.label = "Nova: check_user";
	check_mail(novaPanel);
	novaPanel.label = "Nova: check_mail";
	window.setInterval(function(){
		check_mail(novaPanel); 
		rep_err(novaPanel);
	}, 60000);
	rep_err(novaPanel);
}, false);

var novaPanel = document.getElementById("nova-panel");
var global_error = 0;
var user_attr = { };
user_attr.rpcuser = "";
user_attr.rpcpassword = "";
user_attr.rpcallowip = "";
user_attr.rpcport = "8344";
user_attr.address = "";
var save_ch = "     ";
var paid_posts = [];
var request_posts = [];
var deleted = 0;
var white_list = [];
var price = 0.1;
var paid_txid = [];

function get_save(){
	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
	var prof = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
	file.initWithPath(prof.path + "\\flag_save.txt");
	if(file.exists()){
		var istream = input_stream();
		istream.init(file, 0x01, 00660, null);
		var mInputStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
		mInputStream.init(istream);
		var save_str = mInputStream.read(mInputStream.available());
		istream.close();
		mInputStream.close();
		save_ch = save_str.match(/false|true/)[0];
		var check_line = document.getElementById("removeUnpaidPosts");
		var check__line = document.getElementById("remove_unpaidPosts");
		check_line.setAttribute("checked", save_ch);
		check__line.setAttribute("checked", save_ch);
	}else{
		save_ch = "false";
		var check_line = document.getElementById("removeUnpaidPosts");
		var check__line = document.getElementById("remove_unpaidPosts");
		check_line.setAttribute("checked", save_ch);
		check__line.setAttribute("checked", save_ch);
		var save_str = "false\r\n";
		var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
		foStream.init(file, 0x02 | 0x08 | 0x20, 0660, 0);
		foStream.write(save_str, save_str.length);
		foStream.close();
	}
}


function save_check(id_name){
	request_posts = [];
	paid_posts = [];
	var check__line = document.getElementById(id_name);
	if(save_ch == "false"){
		save_ch = "true";
		check__line.setAttribute("checked", save_ch);
	}
	else{
		save_ch = "false";
		check__line.setAttribute("checked", save_ch);
	}
	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
	var prof = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
	file.initWithPath(prof.path + "\\flag_save.txt");
	var istream = input_stream();
	istream.init(file, 0x01, 00660, null);
	var mInputStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
	mInputStream.init(istream);
	var save_str = mInputStream.read(mInputStream.available());
	istream.close();
	mInputStream.close();
	save_str = save_str.replace(/false|true/,save_ch);
	var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
	foStream.init(file, 0x02 | 0x20, 0660, null);
	foStream.write(save_str,save_str.length);
	foStream.close();
}

function check_nova(novaPanel){
	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
	var roaming = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("AppData", Components.interfaces.nsIFile);
	file.initWithPath(roaming.path+"\\NovaCoin\\");
	if(!file.exists()){
		global_error = 1;
		var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
		var result = prompts.confirm(null, title_not_found, err_client_not_found);
		if(result){
			var ww = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService(Components.interfaces.nsIWindowWatcher);
			var win = ww.openWindow(null, "http://sourceforge.net/projects/novacoin/files/latest/download?source=files","aboutNovacoin", "chrome,centerscreen", null);
			novaPanel.label = msg_after_install;
		}
		else{
			novaPanel.label = "Nova: " + global_error + err_dir_not_found;
		}
	}
}

function check_conf(novaPanel){
	if(!global_error){
		var file = local_file();
		var roaming = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("AppData", Components.interfaces.nsIFile);
		file.initWithPath(roaming.path+"\\NovaCoin\\novacoin.conf");
		if(!file.exists()){
			global_error = 2;
			var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
			var result = prompts.confirm(null, title_conf_not_found, err_conf_not_found);
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
				var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
				foStream.init(file, 0x02 | 0x08 | 0x20, 0660, 0);
				foStream.write(conf, conf.length);
				foStream.close();
				novaPanel.label = msg_conf_created;
			}
			else{
				novaPanel.label = status_no_conf;
			}
		}
	}
}



function check_user(novaPanel){
  novaPanel.label = "Nova: check user 0";
	if(!global_error){     
		var file = local_file();
		var roaming = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("AppData", Components.interfaces.nsIFile);
    novaPanel.label = "Nova: AppData = " + roaming.path;    
		file.initWithPath(roaming.path+"\\NovaCoin\\novacoin.conf");
    
		var istream = input_stream();
		istream.init(file, 0x01, 00660, null);
		var mInputStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
		mInputStream.init(istream);
		var conf = mInputStream.read(mInputStream.available());
		istream.close();
		mInputStream.close();
		user_attr.rpcuser = conf.match(/^rpcuser.*\w/gm)[0].slice(8);
		user_attr.rpcpassword =  conf.match(/^rpcpassword.*\w/gm)[0].slice(12);
		user_attr.rpcallowip = conf.match(/^rpcallowip.*\w/gm)[0].slice(11);
    var v = conf.match(/^rpcport.*\w/gm)[0].slice(8); 
    if (v) user_attr.rpcport = v;
    novaPanel.label = "Nova: rpcuser=" + user_attr.rpcuser + ", rpcport=" + user_attr.rpcport;  
   
		var prof = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
    var file_name = prof.path + "\\extensions\\user_save.conf"; 
		file.initWithPath(file_name);
		if(file.exists()){
      novaPanel.label = "Nova: parsing " + file_name;
			var istream = input_stream();
			istream.init(file, 0x01, 00660, null);
			var mInputStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
			mInputStream.init(istream);
			var save_str = mInputStream.read(mInputStream.available());
			istream.close();
			mInputStream.close();
			if(save_str.match(/^price=\d/gm)){
				price = parseFloat(save_str.match(/^price=.*\w/gm)[0].slice(6).replace(",","."));
			}
			if(save_str.match(/\w[а-яА-Яa-z0-9A-Z-_.]*@[а-яА-Яa-z0-9A-Z-_.]*\w/g)){
				white_list = save_str.match(/\w[а-яА-Яa-z0-9A-Z-_.]*@[а-яА-Яa-z0-9A-Z-_.]*\w/g);}
			if(save_str.match(/address=4[a-z0-9A-Z]{33}/)){
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
			var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
			foStream.init(file, 0x02 | 0x08 | 0x20, 0660, 0);
			foStream.write(save_str, save_str.length);
			foStream.close();
			var req = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
			req.open('POST', "http://" + user_attr.rpcuser + ":" + user_attr.rpcpassword + "@" + user_attr.rpcallowip + ":" + user_attr.rpcport + "/",false);
			req.setRequestHeader('Content-Type', 'text/plain');
			req.send('{ \"method\": \"getaccountaddress\", \"params\": ["' + user_attr.rpcuser + '"]}');
			if(req.readyState == 4){
				user_attr.address = JSON.parse(req.responseText).result;
				global_error = 3;
			}
			else{
				novaPanel.label = err_client_not_run + "(check_user)";
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
//var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);

function request_payment(novaPanel,do_it){
  if (1) return; // debug mode

	var acctMgr = Components.classes["@mozilla.org/messenger/account-manager;1"].getService(Components.interfaces.nsIMsgAccountManager);
	novaPanel.label = "Nova: start request_payment";
	var cf = Components.classes["@mozilla.org/messengercompose/composefields;1"].createInstance(Components.interfaces.nsIMsgCompFields);
	cf.from = (ms_hr.mime2DecodedRecipients + ms_hr.recipients).match(/<[а-яА-Яa-z0-9A-Z-_.]*@[а-яА-Яa-z0-9A-Z-_.]*>/)[0].slice(1,-1);
	cf.subject = rpl_subject;
	cf.to = (ms_hr.mime2DecodedAuthor + ms_hr.author).match(/<[а-яА-Яa-z0-9A-Z-_.]*@[а-яА-Яa-z0-9A-Z-_.]*>/)[0].slice(1,-1);
	cf.body = do_it;
//prompts.alert(null, cf.to, cf.body);
	var params = Components.classes["@mozilla.org/messengercompose/composeparams;1"].createInstance(Components.interfaces.nsIMsgComposeParams);
	params.composeFields = cf;
	var msgSend = Components.classes["@mozilla.org/messengercompose/send;1"].createInstance(Components.interfaces.nsIMsgSend);
	var msgCompose = Components.classes["@mozilla.org/messengercompose/compose;1"].createInstance(Components.interfaces.nsIMsgCompose);
	msgCompose.compFields = cf;
	msgCompose.initialize(params,null);
	msgCompose.SendMsg(msgSend.nsMsgDeliverNow, acctMgr.defaultAccount.defaultIdentity, acctMgr.defaultAccount.key, null, null);
	request_posts.push(ms_hr.messageKey);
	novaPanel.label = "Nova: end request_payment";
	msg_num++;
	window.setTimeout(function () {
		start_msg(novaPanel);
	},30);
}

function process_account(novaPanel){
	novaPanel.label = "Nova: start process_account";
	var acctMgr = Components.classes["@mozilla.org/messenger/account-manager;1"].getService(Components.interfaces.nsIMsgAccountManager);
	var accounts = acctMgr.accounts;
	msg_num = 0;
	var account = accounts.queryElementAt(0, Components.interfaces.nsIMsgAccount);
	var rootFolder = account.incomingServer.rootFolder;
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
    // verify message loop
	  while(entries.hasMoreElements()){
			var entry = entries.getNext();
			entry.QueryInterface(Components.interfaces.nsIMsgDBHdr);
			var e_ml = (entry.mime2DecodedAuthor + entry.author).match(/<[а-яА-Яa-z0-9A-Z-_.]*@[а-яА-Яa-z0-9A-Z-_.]*>/)[0].slice(1,-1);
			if((paid_posts.indexOf(entry.messageKey) == -1) && (request_posts.indexOf(entry.messageKey) == -1) && (white_list.indexOf(e_ml) == -1)){
			  	array_msg.push(entry);
			}
		}
		window.setTimeout(function () {
			start_msg(novaPanel);
		},10);
	}
	novaPanel.label = "Nova: end process_account";
}

function start_msg(novaPanel){
//prompts.alert(null, "", "start start_msg " + msg_num + " " + array_msg.length + " " + nova_inbox.URI );
	novaPanel.label = "Nova: start start_msg";
	if(msg_num < array_msg.length){
		novaPanel.label = "Nova: work start_msg, in array";
		ms_hr = array_msg[msg_num];
		var uri_m = nova_inbox.getUriForMsg(ms_hr);
		let messenger = Components.classes["@mozilla.org/messenger;1"].createInstance(Components.interfaces.nsIMessenger);
		let listener = Components.classes["@mozilla.org/network/sync-stream-listener;1"].createInstance(Components.interfaces.nsISyncStreamListener);
		messenger.messageServiceFromURI(uri_m).streamMessage(uri_m, listener, null, null, false, "");
		var mssg = nova_inbox.getMsgTextFromStream(listener.inputStream,ms_hr.Charset,ms_hr.messageSize,ms_hr.offlineMessageSize,false,true,{ });
		if(mssg.match(/[0-9a-z]{64}/)){
//prompts.alert(null, "", "match txid" );
			novaPanel.label = err_client_not_run + "(start_msg)";
			txid = mssg.match(/[0-9a-z]{64}/)[0];
			var req = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
			req.open('POST', "http://" + user_attr.rpcuser + ":" + user_attr.rpcpassword + "@" + user_attr.rpcallowip + ":" + user_attr.rpcport + "/", false);
			req.setRequestHeader('Content-Type', 'text/plain');
			req.send('{ \"method\": \"gettransaction\", \"params\": ["' + txid + '"]}');
			if(req.readyState == 4){
				tranz = JSON.parse(req.responseText);
				window.setTimeout(function () {
					process_message(novaPanel);
				},10);
			}
			else{
				window.setTimeout(function () {
					start_msg(novaPanel);
				},30);
			}
		}
		else{
			request_payment(novaPanel, rpl_body_1 + price + rpl_body_2 + user_attr.address + rpl_body_3);
			if(save_ch == "true"){
				gFolderDisplay.selectMessage(ms_hr);
				MsgMoveMessage(nova_trash);
				deleted++;
			}
		}
	}
	else{
		novaPanel.label = "Nova: end start_msg";
		window.setTimeout(function () {
			rep_err(novaPanel);
		},60);
	}
}

function process_message(novaPanel){
//prompts.alert(null, "", "start process_message" );
	novaPanel.label = "Nova: start process_message";
	if(tranz.error && (tranz.error.code == -5)){
		request_payment(novaPanel, err_incorrect_txid);
		if(save_ch == "true"){
			gFolderDisplay.selectMessage(ms_hr);
			MsgMoveMessage(nova_trash);
			deleted++;
		}
	}
	else if(tranz.result.details[0].address != user_attr.address){
		request_payment(novaPanel, err_wrong_target + price + rpl_body_2s + user_attr.address + rpl_body_3);
		if(save_ch == "true"){
			gFolderDisplay.selectMessage(ms_hr);
			MsgMoveMessage(nova_trash);
			deleted++;
		}
	}
	else if(tranz.result.amount < price){
		request_payment(novaPanel, msg_u_send_to + user_attr.address + msg_bellow + price + " NVC" + rpl_body_1 + price + rpl_body_2d + rpl_body_3);
		if(save_ch == "true"){
			gFolderDisplay.selectMessage(ms_hr);
			MsgMoveMessage(nova_trash);
			deleted++;
		}
	}
	else if(tranz.result.vout[0].value == 0){
		request_payment(novaPanel, err_no_comission + rpl_body_1 + price + rpl_body_2 + user_attr.address + rpl_body_3);
		if(save_ch == "true"){
			gFolderDisplay.selectMessage(ms_hr);
			MsgMoveMessage(nova_trash);
			deleted++;
		}
	}
	else if(paid_posts.indexOf(txid) != -1){
		request_payment(novaPanel, err_double_use + txid + rpl_body_1 + price + rpl_body_2 + user_attr.address + rpl_body_3);
		if(save_ch == "true"){
			gFolderDisplay.selectMessage(ms_hr);
			MsgMoveMessage(nova_trash);
			deleted++;
		}
	}
	else{
		paid_posts.push(ms_hr.messageKey);
		paid_txid.push(txid);
		msg_num++;
		novaPanel.label = "Nova: paid message"; 
		window.setTimeout(function () {
			start_msg(novaPanel);
		},10);
	}
}


function check_mail(novaPanel){
	novaPanel.label = "Nova: start check mail";
	if(global_error == 3){
		process_account(novaPanel);
	
	}
	else if(global_error == 0){
		novaPanel.label = err_client_not_run + "(check_mail)";
	}
}
