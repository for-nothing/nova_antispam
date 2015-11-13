(function() {
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
		check_nova(novaPanel);
//novaPanel.label = "check_nova(novaPanel);";
		check_conf(novaPanel);
//novaPanel.label = "check_conf(novaPanel);";
		check_user();
//novaPanel.label = "check_user();";
		check_mail(novaPanel);
//novaPanel.label = "check_mail(novaPanel);";
		var newMailListener = {
			msgAdded: function(){  
				check_mail(nova_panel());
			}
		}
		var notificationService = Components.classes["@mozilla.org/messenger/msgnotificationservice;1"].getService(Components.interfaces.nsIMsgFolderNotificationService);
		notificationService.addListener(newMailListener, notificationService.msgAdded);
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
			save_ch = set_check("remove_unpaidPosts",save_ch);
			save_check();
			check_mail(nova_panel());
		},false);
		var sync_book = document.getElementById("syncAddrBook");
		sync_book.addEventListener("command",function(){
			sync_ch = set_check("sync_AddrBook",sync_ch);
			save_check();
		},false);
		var accManagement = document.getElementById("accManagement");
		accManagement.addEventListener("command",function(){
			accIdNum = 0;
			enbl_accnts = [];
			acc_mngmnt();
		}, false);
		var check_sig = document.getElementById("checkSigPosts");
		check_sig.addEventListener("command",function(){
			sig_ch = set_check("check_SigPosts",sig_ch);
			save_check();
			check_mail(nova_panel());
		}, false);
		var moveToSpam = document.getElementById("moveToSpam");
		moveToSpam.addEventListener("command",function(){
			toSpam = set_check("move_ToSpam",toSpam);
			save_check();
		}, false);
		var set__price = document.getElementById("set_nvcPrice");
		if(set__price){
			var move_ToSpam = document.getElementById("move_ToSpam");
			move_ToSpam.addEventListener("command",function(){
				toSpam = set_check("moveToSpam",toSpam);
				save_check();
			}, false);
			set__price.addEventListener("click",function(){
				save_price();
			},false);
			var check__sig = document.getElementById("check_SigPosts");
			check__sig.addEventListener("command",function(){
				sig_ch = set_check("checkSigPosts",sig_ch);
				save_check();
				check_mail(nova_panel());
			}, false);
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
				save_ch = set_check("removeUnpaidPosts",save_ch);
				save_check();
				check_mail(nova_panel());
			},false);
			var sync__book = document.getElementById("sync_AddrBook");
			sync__book.addEventListener("click",function(){
				sync_ch = set_check("syncAddrBook",sync_ch);
				save_check();
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
			itTb = false;
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

	var itTb = true;
	var toSpam = "false";
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
	var sig_ch = "";
	var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
	var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
	var prof = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
	var slash = "";
	(function() {
		if(prof.path.match("/")){
			slash = "/";
		}
		else{
			slash = "\\";
		}
	})();


	function convert_file_out(file,what_to_do,write){
		var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
		foStream.init(file, what_to_do, 0660, 0);
		var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
		converter.init(foStream, "UTF-8", 0, 0);
		converter.writeString(write);
		foStream.close();
		converter.close();
	}

	function get_nvc_addres(pub_key){
		function to_arr(str_hash){
			var hex_arr = [];
			var hex_num = 0;
			for(var i = 0;i < str_hash.length;i +=2){
				hex_num = parseInt(str_hash.substr(i,2),16);
				hex_arr.push(hex_num);
			}
			return hex_arr;
		}
		function toHexString(charCode){
			return ("0" + charCode.toString(16)).slice(-2);
		}
		var arr_bytes = to_arr(pub_key);
		var ch = Components.classes["@mozilla.org/security/hash;1"].createInstance(Components.interfaces.nsICryptoHash);
		ch.init(ch.SHA256);
		ch.update(arr_bytes, arr_bytes.length);
		var hash = ch.finish(false);
		var hash_str = [toHexString(hash.charCodeAt(i)) for (i in hash)].join("");
		var words = CryptoJS.enc.Hex.parse(hash_str);
		hash = CryptoJS.RIPEMD160(words);
		hash_str = "08" + hash.toString(CryptoJS.enc.Hex);
		arr_bytes = to_arr(hash_str);
		ch.init(ch.SHA256);
		ch.update(arr_bytes, arr_bytes.length);
		hash = ch.finish(false);
		var hash_str1 = [toHexString(hash.charCodeAt(i)) for (i in hash)].join("");
		arr_bytes = to_arr(hash_str1);
		ch.init(ch.SHA256);
		ch.update(arr_bytes, arr_bytes.length);
		hash = ch.finish(false);
		hash_str1 = [toHexString(hash.charCodeAt(i)) for (i in hash)].join("");
		hash_str = hash_str + hash_str1.substr(0,8);
		var code_string = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
		var big_int = bigInt(hash_str,16);
		var mod1 = big_int.divmod(58);
		var quotient1 = mod1.quotient;
		var addr_in_b58 = code_string.charAt(mod1.remainder.value[0]);
		for(var i = 0;i < 33;i++){
			big_int = quotient1;
			mod1 = big_int.divmod(58);
			addr_in_b58 = code_string.charAt(mod1.remainder.value[0]) + addr_in_b58;
			quotient1 = mod1.quotient;
		}
		return addr_in_b58;
	}

	function payLetter(){
		var strbundle = document.getElementById("novastrings");
		var d_fold = gFolderDisplay.displayedFolder;
		var p_hr = gFolderDisplay.selectedMessage;
		var messenger = Components.classes["@mozilla.org/messenger;1"].createInstance(Components.interfaces.nsIMessenger);
		var listener = Components.classes["@mozilla.org/network/sync-stream-listener;1"].createInstance(Components.interfaces.nsISyncStreamListener);
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
		if(mssg.match(/ 4[a-z0-9A-Z]{33}/)){
			var addr = mssg.match(/ 4[a-z0-9A-Z]{33}/)[0].slice(1);
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
					req.send("{ \"method\": \"sendmany\", \"params\": [\"\",{ \"" + addr + "\": " + amount + ",\"" + user_attr.address + "\": 0.1}]}");
					if(req.readyState == 4){
						var trnz = JSON.parse(req.responseText);
						if(!trnz.error){
							var tx_id = trnz.result;
							req.open('POST', "http://" + user_attr.rpcuser + ":" + user_attr.rpcpassword + "@" + user_attr.rpcallowip + ":" + user_attr.rpcport + "/", false);
							req.send('{ \"method\": \"gettransaction\", \"params\": ["' + tx_id + '"]}');
							trnz = JSON.parse(req.responseText);
							addr = get_nvc_addres(trnz.result.vin[0].scriptSig.asm.substr(-66,66));
						}
					}
					Components.utils.import("resource:///modules/gloda/mimemsg.js");
					uri_m = outbox.getUriForMsg(s_hr);
					var listener = Components.classes["@mozilla.org/network/sync-stream-listener;1"].createInstance(Components.interfaces.nsISyncStreamListener);
					aval = messenger.messageServiceFromURI(uri_m).streamMessage(uri_m, listener, null, null, false, "");
					mssg = outbox.getMsgTextFromStream(listener.inputStream,s_hr.Charset,s_hr.messageSize,s_hr.messageSize,false,true,{ });
					listener.close();
					req.open('POST', "http://" + user_attr.rpcuser + ":" + user_attr.rpcpassword + "@" + user_attr.rpcallowip + ":" + user_attr.rpcport + "/", false);
					req.send("{ \"method\": \"signmessage\", \"params\": [ \"" + addr + "\", \"" + tx_id + "\"]}");
					var sig = "";
					if(req.readyState == 4){
						trnz = JSON.parse(req.responseText);
						if(!trnz.error){
							sig = trnz.result;
						}
					}
					var att_nts;
					var cf = Components.classes["@mozilla.org/messengercompose/composefields;1"].createInstance(Components.interfaces.nsIMsgCompFields);
					cf.from = (s_hr.mime2DecodedAuthor + "<" + s_hr.author).match(/[()"'а-яА-Яa-z0-9A-Z.!#$%&*+-/=?^_`{}|~ ]*@[() а-яА-Яa-z0-9A-Z-_.:]*/)[0];
					cf.to = (s_hr.mime2DecodedRecipients + "<" + s_hr.recipients).match(/[()'"а-яА-Яa-z0-9A-Z.!#$%&*+-/=?^_`{}|~ ]*@[() а-яА-Яa-z0-9A-Z-_.:]*/)[0];
					cf.subject = s_hr.mime2DecodedSubject;
					cf.body = tx_id + " sig:" + sig + " " + mssg + "\r\n";
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
				prompts.alert(null,strbundle.getString("not_enough_data"),strbundle.getString("not_enough_data")+ " !7");
			}
		}
		else{
			prompts.alert(null,strbundle.getString("not_enough_data"),strbundle.getString("not_enough_data") + " !3");
		}
	}

	function save_address(){
		var address_write = "address=" + user_attr.address ;
		file.initWithPath(prof.path + slash + "user_save.txt");
		var save_str = file_in(file);
		save_str = save_str.replace(/^addres+=.*\w/gm,address_write);
		simple_file_out(file,0x02 | 0x20,save_str);
	}

	function acc_mngmnt(){
		var strbundle = document.getElementById("novastrings");
		var acctMgr = Components.classes["@mozilla.org/messenger/account-manager;1"].getService(Components.interfaces.nsIMsgAccountManager);
		var identities = acctMgr.allIdentities;
		if(accIdNum < identities.length){
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
			file.initWithPath(prof.path + slash + "accnts_save.txt");
			convert_file_out(file,0x02 | 0x08 | 0x20,acc_write);
			check_mail(nova_panel());
		}
	}

	function save_posts(){
		var posts_write = paid_posts.join("\r\n") + "\r\n";
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
		file.initWithPath(prof.path + slash + "txid_save.txt");
		if(file.exists()){
			simple_file_out(file,0x02 | 0x20,txid_write);
		}
		else{
			simple_file_out(file,0x02 | 0x08 | 0x20,txid_write);
		}
	}

	function save_price(){
		var strbundle = document.getElementById("novastrings");
		var check = {value: false};
		var input = {value: price};
		var result = prompts.prompt(null, strbundle.getString("amount_nvc"), strbundle.getString("enter_amount"), input, null, check);
		if(result){
			price = input.value.replace(",",".");
			var price_write = "price=" + price ;
			file.initWithPath(prof.path + slash + "user_save.txt");
			var save_str = file_in(file);
			save_str = save_str.replace(/^price=.*\w/gm,price_write);
			simple_file_out(file,0x02 | 0x20,save_str);
		}
	}

	function set_address(){
		var strbundle = document.getElementById("novastrings");
		var check = {value: false};
		var input = {value: user_attr.address};
		var result = prompts.prompt(null, strbundle.getString("address_nvc"), strbundle.getString("enter_address_nvc"), input, null, check);
		if(result){
			user_attr.address = input.value;
			var address_write = "address=" + user_attr.address ;
			file.initWithPath(prof.path + slash + "user_save.txt");
			var save_str = file_in(file);
			save_str = save_str.replace(/addres+=.*\w/gm,address_write);
			simple_file_out(file,0x02 | 0x20,save_str);
		}
	}

	function save_eml(){
		var strbundle = document.getElementById("novastrings");
		var check = {value: false};
		var input = {value: ""};
		var result = prompts.prompt(null, strbundle.getString("address_eml"), strbundle.getString("enter_address_eml"), input, null, check);
		if(result){
			var input_eml = input.value.split(',');
			white_list = white_list.concat(input_eml);
			var eml_write = input_eml.join("\r\n");
			file.initWithPath(prof.path + slash + "user_save.txt");
			convert_file_out(file,0x02 | 0x10,eml_write);
		}
	}

	function set_check(id_name,flag){
		var check__line = document.getElementById(id_name);
		if(flag == "false"){
			flag = "true";
		}
		else{
			flag = "false";
		}
		if(check__line){
			check__line.setAttribute("checked", flag);
		}
		return flag;
	}

	function save_check(){
		file.initWithPath(prof.path + slash + "flag_save02.txt");
		var save_str =  "removeUnpaidPosts=" + save_ch + "\r\nsyncAddrBook=" + sync_ch + "\r\nremoveUnsignedPosts=" + sig_ch + "\r\nmoveToSpam=" + toSpam + "\r\n";
		simple_file_out(file,0x02 | 0x20,save_str);
	}

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
		file.initWithPath(prof.path + slash + "flag_save02.txt");
		var check_line = document.getElementById("removeUnpaidPosts");
		var sync_book = document.getElementById("syncAddrBook");
		var check_sig = document.getElementById("checkSigPosts");
		var moveToSpam = document.getElementById("moveToSpam");
		var check__line = document.getElementById("remove_unpaidPosts");
		if(check__line){
			var sync__book = document.getElementById("sync_AddrBook");
			var check__sig = document.getElementById("check_SigPosts");
			var move_ToSpam = document.getElementById("move_ToSpam");
		}
		if(file.exists()){
			var save_str = file_in(file);
			save_ch = save_str.match(/false|true/g)[0];
			sync_ch = save_str.match(/false|true/g)[1];
			sig_ch = save_str.match(/false|true/g)[2];
			toSpam = save_str.match(/false|true/g)[3];
		}
		else{
			save_ch = "false";
			sync_ch = "true";
			sig_ch = "false";
			toSpam = "false";
			var save_str = "removeUnpaidPosts=false\r\nsyncAddrBook=true\r\nremoveUnsignedPosts=false\r\nmoveToSpam=false\r\n";
			simple_file_out(file,0x02 | 0x08 | 0x20,save_str);
		}
		check_line.setAttribute("checked", save_ch);
		sync_book.setAttribute("checked", sync_ch);
		check_sig.setAttribute("checked", sig_ch);
		moveToSpam.setAttribute("checked", toSpam);
		if(check__line){
			check__line.setAttribute("checked", save_ch);
			sync__book.setAttribute("checked", sync_ch);
			check__sig.setAttribute("checked", sig_ch);
			move_ToSpam.setAttribute("checked", toSpam);
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
		var strbundle = document.getElementById("novastrings");
		var home = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("Home", Components.interfaces.nsIFile);
		if(home.path.match("/")){
			var nova = "/.novacoin";
		}
		else{
			var nova = "\\AppData\\Roaming\\NovaCoin\\";
		}
		file.initWithPath(home.path + nova);
		if(!file.exists()){
			global_error = 1;
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
			var strbundle = document.getElementById("novastrings");
			var home = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("Home", Components.interfaces.nsIFile);
			if(home.path.match("/")){
				var nova = "/.novacoin/novacoin.conf";
			}
			else{
				var nova = "\\AppData\\Roaming\\NovaCoin\\novacoin.conf";
			}
			file.initWithPath(home.path + nova);
			if(!file.exists()){
				global_error = 2;
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
			else{
				var conf = file_in(file);
				user_attr.rpcuser = conf.match(/^rpcuser.*\w/gm)[0].slice(8);
				user_attr.rpcpassword = conf.match(/^rpcpassword.*\w/gm)[0].slice(12);
				user_attr.rpcallowip = conf.match(/^rpcallowip.*\w/gm)[0].slice(11);
				var v = conf.match(/^rpcport.*\w/gm)[0].slice(8);
				if (v) user_attr.rpcport = v;
				if(!conf.match(/^server=1/gm)){
					global_error = 4;
					var result = prompts.confirm(null, strbundle.getString("title_edit_conf"), strbundle.getString("want_edit_conf"));
					if(result){
						if(conf.match(/^server=0|^#server=./gm)){
							conf = conf.replace(/^server=0|^#server=./gm,"server=1");
						}
						else{
							conf = conf + "\r\nserver=1\r\n";
						}
						simple_file_out(file,0x02 | 0x08 | 0x20,conf);
						novaPanel.label = strbundle.getString("must_restart");
					}
					else{
						novaPanel.label = strbundle.getString("cannot_use");	
					}
				}
			}
		}
	}

	function check_user(){
		if(!global_error){
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

	var ms_hr = { };
	var msg_num = 0;
	var array_msg = [];
	var tranz = "";
	var txid = "";
	var nova_inbox = { };
	var nova_trash = { };
	var nova_outbox = { };
	var acc_num = 0;
	var nova_acc = { };
	var nova_ident = { };
	var start_fold = { };
	var mssg_from_hr = "";

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
		},130);
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
					if(toSpam == "false"){
						var regTrash = /trash|корзина|удал[ёе]нные/i;
					}
					else{
						var regTrash = /spam|спам/i;
					}
					var rootFolder = nova_acc.incomingServer.rootFolder;
					var hasTrash = false;
					var hasInbox = false;
					var hasOutbox = false;
					if (rootFolder.hasSubFolders){
						var subFolders = rootFolder.subFolders;
						while(subFolders.hasMoreElements()){
							var folder = subFolders.getNext().QueryInterface(Components.interfaces.nsIMsgFolder);
							if(folder.name.match(/inbox|входящие/i)){
								nova_inbox = folder;
								hasInbox = true;
							}
							if(folder.name.match(regTrash)){
								nova_trash = folder;
								hasTrash = true;
							}
							if(folder.name.match(/outbox|исходящие|отправленные/i)){
								nova_outbox = folder;	
								hasOutbox = true;
							}
							if(hasOutbox && hasTrash && hasInbox){
								break;
							}
							if(folder.hasSubFolders){
								var gm = folder.subFolders;
								while(gm.hasMoreElements()){
									var s_f = gm.getNext().QueryInterface(Components.interfaces.nsIMsgFolder);
									if(s_f.name.match(/inbox|входящие/i)){
										nova_inbox = s_f;
										hasInbox = true;
									}
									if(s_f.name.match(regTrash)){
										nova_trash = s_f;
										hasTrash = true;
									}
									if(s_f.name.match(/outbox|исходящие|отправленные/i)){
										nova_outbox = s_f;	
										hasOutbox = true;
									}
								}
							}
						}
					}
					if(hasOutbox && hasTrash && hasInbox){
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
			if(start_fold && itTb){
				gFolderTreeView.selectFolder(start_fold);
			}
			window.setTimeout(function () {
				rep_err(nova_panel());
			},60);
		}
	}

	function start_msg(novaPanel){
		if(msg_num < array_msg.length){
			var strbundle = document.getElementById("novastrings");
			function it_local(){
				if(mssg_from_hr.match(/[0-9a-z]{64}/)){
					novaPanel.label = strbundle.getString("err_client_not_run") + "(start_msg)";
					txid = mssg_from_hr.match(/[0-9a-z]{64}/)[0];
					var req = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
					req.open('POST', "http://" + user_attr.rpcuser + ":" + user_attr.rpcpassword + "@" + user_attr.rpcallowip + ":" + user_attr.rpcport + "/", false);
					req.send('{ \"method\": \"gettransaction\", \"params\": ["' + txid + '"]}');
					if(req.readyState == 4){
						tranz = req.responseText;
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
					if(sig_ch == "true"){
						var endMsg = strbundle.getString("how_to_add_signature");
					}
					else{
						var endMsg = strbundle.getString("rpl_body_3");
					}
					request_payment( strbundle.getString("rpl_body_1") + ms_hr.messageId + "> " + ms_hr.mime2DecodedSubject + strbundle.getString("rpl_body_1a") + price + strbundle.getString("rpl_body_2") + user_attr.address + endMsg);
					if(save_ch == "true"){
						window.setTimeout(function () {
							gFolderDisplay.selectMessage(ms_hr);
							MsgMoveMessage(nova_trash);
							deleted++;
						},70);
					}
				}
			}
			if(itTb){
				gFolderTreeView.selectFolder(nova_inbox);
			}
			ms_hr = array_msg[msg_num];
			var uri_m = nova_inbox.getUriForMsg(ms_hr);
			let messenger = Components.classes["@mozilla.org/messenger;1"].createInstance(Components.interfaces.nsIMessenger);
			let listener = Components.classes["@mozilla.org/network/sync-stream-listener;1"].createInstance(Components.interfaces.nsISyncStreamListener);
			var aval = messenger.messageServiceFromURI(uri_m).streamMessage(uri_m, listener, null, null, false, "");
			mssg_from_hr = nova_inbox.getMsgTextFromStream(listener.inputStream,ms_hr.Charset,ms_hr.messageSize,ms_hr.messageSize,false,true,{ });
			listener.close();
			if(mssg_from_hr.match(/\WmessageId:[() '"\wа-яА-я.!#$%&*+-/=?^_`{}|~@:]*/)){
				var msid = mssg_from_hr.match(/\WmessageId:[() '"\wа-яА-я.!#$%&*+-/=?^_`{}|~@:]*/)[0].slice(11);
				var entries = nova_outbox.messages;
				var go_cont = true;
				while(entries.hasMoreElements()){
					var entry = entries.getNext();
					entry.QueryInterface(Components.interfaces.nsIMsgDBHdr);
					if(entry.messageId == msid){
						msg_num++;
						go_cont = false;
						window.setTimeout(function () {
							start_msg(nova_panel());
						},30);
						break;
					}
				}
				if(go_cont){
					it_local();
				}
			}
			else{
				it_local();
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
		trObj = JSON.parse(tranz);
		if(trObj.error && (trObj.error.code == -5)){
			request_payment( strbundle.getString("err_incorrect_txid") + ms_hr.messageId + "> " + ms_hr.mime2DecodedSubject + strbundle.getString("err_incorrect_txid1"));
			if(save_ch == "true"){
				window.setTimeout(function () {
					gFolderDisplay.selectMessage(ms_hr);
					MsgMoveMessage(nova_trash);
					deleted++;
				},70);
			}
		}
		else{
			if(sig_ch == "true"){
				var endMsg = strbundle.getString("how_to_add_signature");
			}
			else{
				var endMsg = strbundle.getString("rpl_body_3");
			}	
			var isNotMe = true;
			var amountMe = 0;
			for(var i = 0;i < trObj.result.vout.length;i++){
				for(var j =0;j < trObj.result.vout[i].scriptPubKey.addresses.length;j++){
					if(trObj.result.vout[i].scriptPubKey.addresses[j] == user_attr.address){
						isNotMe = false;
						amountMe = trObj.result.vout[i].value;
						break;
					}
				}
				if(!isNotMe){
					break;
				}
			}
			if(isNotMe){
				request_payment(strbundle.getString("err_wrong_target") + ms_hr.messageId + "> " + ms_hr.mime2DecodedSubject + strbundle.getString("err_wrong_target1") + price + strbundle.getString("rpl_body_2s") + user_attr.address + endMsg);
				if(save_ch == "true"){
					window.setTimeout(function () {
						gFolderDisplay.selectMessage(ms_hr);
						MsgMoveMessage(nova_trash);
						deleted++;
					},70);
				}
			}
			else if(amountMe < price){
				request_payment(strbundle.getString("msg_u_send_to") + user_attr.address + strbundle.getString("msg_bellow") + price + " NVC" + strbundle.getString("rpl_body_1") + ms_hr.messageId + "> " + ms_hr.mime2DecodedSubject + strbundle.getString("rpl_body_1a") + price + strbundle.getString("rpl_body_2d") + endMsg);
				if(save_ch == "true"){
					window.setTimeout(function () {
						gFolderDisplay.selectMessage(ms_hr);
						MsgMoveMessage(nova_trash);
						deleted++;
					},70);
				}
			}
			else if(!tranz.match("fee")){
				request_payment(strbundle.getString("err_no_comission") + strbundle.getString("rpl_body_1") + ms_hr.messageId + "> " + ms_hr.mime2DecodedSubject + strbundle.getString("rpl_body_1a") + price + strbundle.getString("rpl_body_2") + user_attr.address + endMsg);
				if(save_ch == "true"){
					window.setTimeout(function () {
						gFolderDisplay.selectMessage(ms_hr);
						MsgMoveMessage(nova_trash);
						deleted++;
					},70);
				}
			}
			else if(tranz.match("fee") && trObj.result.fee == 0){
				request_payment(strbundle.getString("err_no_comission") + strbundle.getString("rpl_body_1") + ms_hr.messageId + "> " + ms_hr.mime2DecodedSubject + strbundle.getString("rpl_body_1a") + price + strbundle.getString("rpl_body_2") + user_attr.address + endMsg);
				if(save_ch == "true"){
					window.setTimeout(function () {
						gFolderDisplay.selectMessage(ms_hr);
						MsgMoveMessage(nova_trash);
						deleted++;
					},70);
				}
			}
			else if(paid_txid.indexOf(txid) != -1){
				request_payment( strbundle.getString("err_double_use") + txid + ". " + strbundle.getString("rpl_body_1") + ms_hr.messageId + "> " + ms_hr.mime2DecodedSubject + strbundle.getString("rpl_body_1a") + price + strbundle.getString("rpl_body_2") + user_attr.address + endMsg);
				if(save_ch == "true"){
					window.setTimeout(function () {
						gFolderDisplay.selectMessage(ms_hr);
						MsgMoveMessage(nova_trash);
						deleted++;
					},70);
				}
			}
			else{
				if(sig_ch == "true"){
					var msg_sig = "";
					if(mssg_from_hr.match(/sig:[\w/+=]*/)){
						msg_sig = mssg_from_hr.match(/sig:[\w/+=]*/)[0].slice(4);
					}
					if(!trObj.error){
						var addr = get_nvc_addres(trObj.result.vin[0].scriptSig.asm.substr(-66,66));
						var req = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance();
						req.open('POST', "http://" + user_attr.rpcuser + ":" + user_attr.rpcpassword + "@" + user_attr.rpcallowip + ":" + user_attr.rpcport + "/", false);
						req.send("{ \"method\": \"verifymessage\", \"params\": [ \"" + addr + "\",\"" + msg_sig + "\", \"" + txid + "\"]}");
						trObj = JSON.parse(req.responseText);
						if(!trObj.error && trObj.result){
							paid_posts.push(ms_hr.messageId);
							paid_txid.push(txid);
							msg_num++;
							window.setTimeout(function () {
								start_msg(nova_panel());
							},10);
						}
						else{
							request_payment( strbundle.getString("in_your_letter") + ms_hr.messageId + "> " + ms_hr.mime2DecodedSubject + strbundle.getString("no_signature") + price + strbundle.getString("rpl_body_2s") + user_attr.address + strbundle.getString("how_to_add_signature"));
							if(save_ch == "true"){
								window.setTimeout(function () {
									gFolderDisplay.selectMessage(ms_hr);
									MsgMoveMessage(nova_trash);
									deleted++;
								},70);
							}
						}
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
})();
