window.addEventListener("load",function(){
	var set_price = document.getElementById("setnvcPrice");
	set_price.addEventListener("command",function(){
		save_price();
	},false);
	var set_addres = document.getElementById("setnvcAddres");
	set_addres.addEventListener("command",function(){
		set_address();
	},false);
	var add_eml = document.getElementById("addToWhiteList");
	add_eml.addEventListener("command",function(){
		save_eml();
	},false);
	var check_line = document.getElementById("removeUnpaidPosts");
	check_line.addEventListener("command",function(){
		save_check("remove_unpaidPosts");
		check_mail(nova_panel());
	},false);
	var sync_book = document.getElementById("syncAddrBook");
	sync_book.addEventListener("command",function(){
		save_sync("sync_AddrBook");
	},false);
	var accManagement = document.getElementById("accManagement");
	accManagement.addEventListener("command",function(){
		accIdNum = 0;
		enbl_accnts = [];
		acc_mngmnt();
	}, false);
	var set__price = document.getElementById("set_nvcPrice");
	if(set__price){
		set__price.addEventListener("click",function(){
			save_price();
		},false);
		var set__addres = document.getElementById("set_nvcAddres");
		set__addres.addEventListener("click",function(){
			set_address();
		},false);
		var add__eml = document.getElementById("add_ToWhiteList");
		add__eml.addEventListener("click",function(){
			save_eml();
		},false);
		var check__line = document.getElementById("remove_unpaidPosts");
		check__line.addEventListener("click",function(){
			save_check("removeUnpaidPosts");
			check_mail(nova_panel());
		},false);
		var sync__book = document.getElementById("sync_AddrBook");
		sync__book.addEventListener("click",function(){
			save_sync("syncAddrBook");
		},false);
		var acc_Management = document.getElementById("acc_Management");
		acc_Management.addEventListener("click",function(){
			accIdNum = 0;
			enbl_accnts = [];
			acc_mngmnt();
		}, false);
		var pay_letter = document.getElementById("payLetter");
		pay_letter.addEventListener("command",function(){
			payLetter();
		}, false);
	}
	else{
		var pay_letter = document.getElementById("pay_letter");
		pay_letter.addEventListener("click",function(){
			payLetter();
		}, false);
	}
}, false);
window.addEventListener("unload",function(){
	save_txid();
	save_posts();
	save_address();
}, false);

function convert_file_out(file,what_to_do,write){
	var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
	foStream.init(file, what_to_do, 0660, 0);
	var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
	converter.init(foStream, "UTF-8", 0, 0);
	converter.writeString(write);
	foStream.close();
	converter.close();
}

function payLetter(){
	var strbundle = document.getElementById("novastrings");
	var d_fold = gFolderDisplay.displayedFolder;
	var p_hr = gFolderDisplay.selectedMessage;
	var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
	let messenger = Components.classes["@mozilla.org/messenger;1"].createInstance(Components.interfaces.nsIMessenger);
	let listener = Components.classes["@mozilla.org/network/sync-stream-listener;1"].createInstance(Components.interfaces.nsISyncStreamListener);
	var uri_m = d_fold.getUriForMsg(p_hr);
	var aval = messenger.messageServiceFromURI(uri_m).streamMessage(uri_m, listener, null, null, false, "");
	var mssg = d_fold.getMsgTextFromStream(listener.inputStream,p_hr.Charset,p_hr.messageSize,p_hr.messageSize,false,true,{ });
	listener.close();
	var has_all = 0;
	if(mssg.match(/\WmessageId:[() '"\wа-яА-я.!#$%&*+-/=?^_`{}|~@:]*/)){
		var msid = mssg.match(/\WmessageId:[() '"\wа-яА-я.!#$%&*+-/=?^_`{}|~@:]*/)[0].slice(11);
		has_all++;
	}
	if(mssg.match(/[\d.]* NVC/)){
		var amount = mssg.match(/[\d.]* NVC/)[0].slice(0,-4);
		has_all++;
	}
	if(mssg.match(/4[a-z0-9A-Z]{33}/)){
		var addr = mssg.match(/4[a-z0-9A-Z]{33}/)[0];
		has_all++;
	}
	if(has_all == 3){
		var my_eml = (p_hr.mime2DecodedRecipients + "<" + p_hr.recipients).match(/[()'"а-яА-Яa-z0-9A-Z.!#$%&*+-/=?^_`{}|~ ]*@[() а-яА-Яa-z0-9A-Z-_.:]*/)[0];
		var acctMgr = Components.classes["@mozilla.org/messenger/account-manager;1"].getService(Components.interfaces.nsIMsgAccountManager);
		var accounts = acctMgr.accounts;
		var acc = { };
		var identity = { };
		var outbox = { };
		var s_hr = { };
		for(var i = 0;i < accounts.length;i++){
			acc = accounts.queryElementAt(i, Components.interfaces.nsIMsgAccount);
			if(acc.incomingServer.prettyName == my_eml){
				has_all++;
				break;
			}
		}
		var identities = acctMgr.allIdentities;
		for(var i = 0;i < identities.length;i++){
			identity = identities.queryElementAt(i,Components.interfaces.nsIMsgIdentity);
			if(identity.email == my_eml){
				has_all++;
				break;
			}
		}
		var rootFolder = acc.incomingServer.rootFolder;
		if (rootFolder.hasSubFolders){
			var subFolders = rootFolder.subFolders;
			while(subFolders.hasMoreElements()){
				var folder = subFolders.getNext().QueryInterface(Components.interfaces.nsIMsgFolder);
				if(folder.name.match(/outbox|исходящие|отправленные/i)){
					outbox = folder;	
					has_all++;
					break;
				}
				if(folder.hasSubFolders){
					var subfold = folder.subFolders;
					while(subfold.hasMoreElements()){
						outbox = subfold.getNext().QueryInterface(Components.interfaces.nsIMsgFolder);
						if(outbox.name.match(/outbox|исходящие|отправленные/i)){
							has_all++;
							break;
						}
					}
				}
				if(has_all == 6){
					break;
				}
			}
		}
		if(has_all == 6){
			var entries = outbox.messages;
			while(entries.hasMoreElements()){
				var entry = entries.getNext();
				entry.QueryInterface(Components.interfaces.nsIMsgDBHdr);
				if(entry.messageId == msid){
					s_hr = entry;
					has_all++;
					break;
				}
			}
		}
		if(has_all == 7){
			var result = prompts.confirm(null, strbundle.getString("title_want_pay"), strbundle.getString("want_pay") + amount + strbundle.getString("want_pay1") + addr + strbundle.getString("want_pay2") + s_hr.mime2DecodedSubject + strbundle.getString("want_pay3"));
			if(result){
				var req = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
				req.open('POST', "http://" + user_attr.rpcuser + ":" + user_attr.rpcpassword + "@" + user_attr.rpcallowip + ":" + user_attr.rpcport + "/", false);
				req.setRequestHeader('Content-Type', 'text/plain');
				req.send("{ \"method\": \"sendtoaddress\", \"params\": [ \"" + addr + "\", " + amount + "]}");
				if(req.readyState == 4){
					var trnz = JSON.parse(req.responseText);
					if(!trnz.error){
						var tx_id = trnz.result;
						has_all++;
					}
				}
			}	
		}
		else{
			prompts.alert(null,strbundle.getString("not_enough_data"),strbundle.getString("not_enough_data"));
		}
		if(has_all == 8){
			Components.utils.import("resource:///modules/gloda/mimemsg.js");
			uri_m = outbox.getUriForMsg(s_hr);
			var listener = Components.classes["@mozilla.org/network/sync-stream-listener;1"].createInstance(Components.interfaces.nsISyncStreamListener);
			aval = messenger.messageServiceFromURI(uri_m).streamMessage(uri_m, listener, null, null, false, "");
			mssg = outbox.getMsgTextFromStream(listener.inputStream,s_hr.Charset,s_hr.messageSize,s_hr.messageSize,false,true,{ });
			listener.close();
			var att_nts;
			var cf = Components.classes["@mozilla.org/messengercompose/composefields;1"].createInstance(Components.interfaces.nsIMsgCompFields);
			cf.from = (s_hr.mime2DecodedAuthor + "<" + s_hr.author).match(/[()"'а-яА-Яa-z0-9A-Z.!#$%&*+-/=?^_`{}|~ ]*@[() а-яА-Яa-z0-9A-Z-_.:]*/)[0];
			cf.to = (s_hr.mime2DecodedRecipients + "<" + s_hr.recipients).match(/[()'"а-яА-Яa-z0-9A-Z.!#$%&*+-/=?^_`{}|~ ]*@[() а-яА-Яa-z0-9A-Z-_.:]*/)[0];
			cf.subject = s_hr.mime2DecodedSubject;
			cf.body = tx_id + " " + mssg + "\r\n";
			var params = Components.classes["@mozilla.org/messengercompose/composeparams;1"].createInstance(Components.interfaces.nsIMsgComposeParams);
			var msgSend = Components.classes["@mozilla.org/messengercompose/send;1"].createInstance(Components.interfaces.nsIMsgSend);
			var msgCompose = Components.classes["@mozilla.org/messengercompose/compose;1"].createInstance(Components.interfaces.nsIMsgCompose);
			MsgHdrToMimeMessage(s_hr, null, function (aMsgHdr, aMimeMessage) {
				att_nts = aMimeMessage.allAttachments;
				for(var i = 0;i < att_nts.length;i++){
					cf.addAttachment(att_nts[i]);
				}
				params.composeFields = cf;
				msgCompose.compFields = cf;
				msgCompose.initialize(params,null);
				msgCompose.SendMsg(msgSend.nsMsgDeliverNow,identity, acc.key, null, null);
			}, true);
		}
	}
	else{
		prompts.alert(null,strbundle.getString("not_enough_data"),strbundle.getString("not_enough_data"));
	}
}

function save_address(){
	var address_write = "address=" + user_attr.address ;
	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
	var prof = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
	if(prof.path.match("/")){
		var slash = "/";
	}
	else{
		var slash = "\\";
	}
	file.initWithPath(prof.path + slash + "user_save.txt");
	var save_str = file_in(file);
	save_str = save_str.replace(/^addres+=.*\w/gm,address_write);
	simple_file_out(file,0x02 | 0x20,save_str);
}

function acc_mngmnt(){
	var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
	var acctMgr = Components.classes["@mozilla.org/messenger/account-manager;1"].getService(Components.interfaces.nsIMsgAccountManager);
	var identities = acctMgr.allIdentities;
	if(accIdNum < identities.length){
		var strbundle = document.getElementById("novastrings");
		var identity = identities.queryElementAt(accIdNum,Components.interfaces.nsIMsgIdentity);
		var result = prompts.confirm(null, strbundle.getString("account_management"), strbundle.getString("detected_account") + identity.email + strbundle.getString("like_to_use"));
		if(result){
			enbl_accnts.push(identity.email);
			accIdNum++;
			window.setTimeout(function () {
				acc_mngmnt();
			},500);
		}
		else{
			accIdNum++;
			window.setTimeout(function () {
				acc_mngmnt();
			},500);
		}
	}
	else{
		var acc_write = enbl_accnts.join("\r\n");
		var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		var prof = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
		if(prof.path.match("/")){
			var slash = "/";
		}
		else{
			var slash = "\\";
		}
		file.initWithPath(prof.path + slash + "accnts_save.txt");
		convert_file_out(file,0x02 | 0x08 | 0x20,acc_write);
	}
	
}

function save_posts(){
	var posts_write = paid_posts.join("\r\n") + "\r\n";
	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
	var prof = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
		if(prof.path.match("/")){
			var slash = "/";
		}
		else{
			var slash = "\\";
		}
		file.initWithPath(prof.path + slash + "posts_save.txt");
	if(file.exists()){
		convert_file_out(file,0x02 | 0x20,posts_write);
	}
	else{
		convert_file_out(file,0x02 | 0x08 | 0x20,posts_write);
	}
}

function save_txid(){
	var txid_write = paid_txid.join("\r\n") + "\r\n";
	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
	var prof = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
		if(prof.path.match("/")){
			var slash = "/";
		}
		else{
			var slash = "\\";
		}
		file.initWithPath(prof.path + slash + "txid_save.txt");
	if(file.exists()){
		simple_file_out(file,0x02 | 0x20,txid_write);
	}
	else{
		simple_file_out(file,0x02 | 0x08 | 0x20,txid_write);
	}
}

function save_price(){
	var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
	var check = {value: false};
	var input = {value: price};
	var strbundle = document.getElementById("novastrings");
	var result = prompts.prompt(null, strbundle.getString("amount_nvc"), strbundle.getString("enter_amount"), input, null, check);
	if(result){
		price = input.value.replace(",",".");
		var price_write = "price=" + price ;
		var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		var prof = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
		if(prof.path.match("/")){
			var slash = "/";
		}
		else{
			var slash = "\\";
		}
		file.initWithPath(prof.path + slash + "user_save.txt");
		var save_str = file_in(file);
		save_str = save_str.replace(/^price=.*\w/gm,price_write);
		simple_file_out(file,0x02 | 0x20,save_str);
	}
}

function set_address(){
	var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
	var check = {value: false};
	var input = {value: user_attr.address};
	var strbundle = document.getElementById("novastrings");
	var result = prompts.prompt(null, strbundle.getString("address_nvc"), strbundle.getString("enter_address_nvc"), input, null, check);
	if(result){
		user_attr.address = input.value;
		var address_write = "address=" + user_attr.address ;
		var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		var prof = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
		if(prof.path.match("/")){
			var slash = "/";
		}
		else{
			var slash = "\\";
		}
		file.initWithPath(prof.path + slash + "user_save.txt");
		var save_str = file_in(file);
		save_str = save_str.replace(/^addres+=.*\w/gm,address_write);
		simple_file_out(file,0x02 | 0x20,save_str);
	}
}

function save_eml(){
	var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
	var check = {value: false};
	var input = {value: ""};
	var strbundle = document.getElementById("novastrings");
	var result = prompts.prompt(null, strbundle.getString("address_eml"), strbundle.getString("enter_address_eml"), input, null, check);
	if(result){
		var input_eml = input.value.split(',');
		white_list = white_list.concat(input_eml);
		var eml_write = input_eml.join("\r\n");
		var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		var prof = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
		if(prof.path.match("/")){
			var slash = "/";
		}
		else{
			var slash = "\\";
		}
		file.initWithPath(prof.path + slash + "user_save.txt");
		convert_file_out(file,0x02 | 0x10,eml_write);
	}
}

function save_check(id_name){
	request_posts = [];
	var check__line = document.getElementById(id_name);
	if(save_ch == "false"){
		save_ch = "true";
	}
	else{
		save_ch = "false";
	}
	if(check__line){
		check__line.setAttribute("checked", save_ch);
	}
	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
	var prof = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
	if(prof.path.match("/")){
		var slash = "/";
	}
	else{
		var slash = "\\";
	}
	file.initWithPath(prof.path + slash + "flag_save013.txt");
	var save_str = file_in(file);
	save_str = save_str.replace(/false|true/,save_ch);
	simple_file_out(file,0x02 | 0x20,save_str);
}

function save_sync(id_name){
	var sync__book = document.getElementById(id_name);
	if(sync_ch == "false"){
		sync_ch = "true";
	}
	else{
		sync_ch = "false";
	}
	if(sync__book){
		sync__book.setAttribute("checked", save_ch);
	}
	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
	var prof = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
	if(prof.path.match("/")){
		var slash = "/";
	}
	else{
		var slash = "\\";
	}
	file.initWithPath(prof.path + slash + "flag_save013.txt");
	var save_str = file_in(file);
	save_str = save_str.replace(/\wsyncAddrBook=.*\w/gm,("syncAddrBook=" + sync_ch));
	simple_file_out(file,0x02 | 0x20,save_str);
}





