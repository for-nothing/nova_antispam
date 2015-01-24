window.addEventListener("load",function(){
	var set_price = document.getElementById("setnvcPrice");
	set_price.addEventListener("command",function(){
		save_price();
	},false);
	var set__price = document.getElementById("set_nvcPrice");
	set__price.addEventListener("click",function(){
		save_price();
	},false);
	var set_addres = document.getElementById("setnvcAddres");
	set_addres.addEventListener("command",function(){
		save_addres();
	},false);
	var set__addres = document.getElementById("set_nvcAddres");
	set__addres.addEventListener("click",function(){
		save_addres();
	},false);
	var add_eml = document.getElementById("addToWhiteList");
	add_eml.addEventListener("command",function(){
		save_eml();
	},false);
	var add__eml = document.getElementById("add_ToWhiteList");
	add__eml.addEventListener("click",function(){
		save_eml();
	},false);
	var check_line = document.getElementById("removeUnpaidPosts");
	check_line.addEventListener("command",function(){
		save_check("remove_unpaidPosts");
		check_mail(nova_panel());
	},false);
	var check__line = document.getElementById("remove_unpaidPosts");
	check__line.addEventListener("click",function(){
		save_check("removeUnpaidPosts");
		check_mail(nova_panel());
	},false);
	var sync_book = document.getElementById("syncAddrBook");
	sync_book.addEventListener("command",function(){
		save_sync("sync_AddrBook");
	},false);
	var sync__book = document.getElementById("sync_AddrBook");
	sync__book.addEventListener("click",function(){
		save_sync("syncAddrBook");
	},false);
	var accManagement = document.getElementById("accManagement");
	accManagement.addEventListener("command",function(){
		accIdNum = 0;
		enbl_accnts = [];
		acc_mngmnt();
	}, false);
	var acc_Management = document.getElementById("acc_Management");
	acc_Management.addEventListener("click",function(){
		accIdNum = 0;
		enbl_accnts = [];
		acc_mngmnt();
	}, false);
}, false);
window.addEventListener("unload",function(){
	save_txid();
	save_posts();
}, false);

function acc_mngmnt(){
	var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
	var acctMgr = Components.classes["@mozilla.org/messenger/account-manager;1"].getService(Components.interfaces.nsIMsgAccountManager);
	var identities = acctMgr.allIdentities;
	if(accIdNum < identities.length){
		var identity = identities.queryElementAt(accIdNum,Components.interfaces.nsIMsgIdentity);
		var result = prompts.confirm(null, account_management, detected_account + identity.email + like_to_use);
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
		var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
		foStream.init(file, 0x02 | 0x08 | 0x20, 0660, 0);
		foStream.write(acc_write, acc_write.length);
		foStream.close();
		check_mail(nova_panel());
	}
	
}

function save_posts(){
	var posts_write = paid_posts.join("\r\n") + "\r\n";
	var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
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
		foStream.init(file, 0x02 | 0x20, 0660, null);
		foStream.write(posts_write,posts_write.length);
		foStream.close();
	}
	else{
		foStream.init(file, 0x02 | 0x08 | 0x20, 0660, null);
		foStream.write(posts_write,posts_write.length);
		foStream.close();
	}
}

function save_txid(){
	var txid_write = paid_txid.join("\r\n") + "\r\n";
	var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
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
		foStream.init(file, 0x02 | 0x20, 0660, null);
		foStream.write(txid_write,txid_write.length);
		foStream.close();
	}
	else{
		foStream.init(file, 0x02 | 0x08 | 0x20, 0660, null);
		foStream.write(txid_write,txid_write.length);
		foStream.close();
	}
}

function save_price(){
	var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
	var check = {value: false};
	var input = {value: price};
	var result = prompts.prompt(null, amount_nvc, enter_amount, input, null, check);
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
		var istream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
		istream.init(file, 0x01, 00660, null);
		var mInputStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
		mInputStream.init(istream);
		var save_str = mInputStream.read(mInputStream.available());
		istream.close();
		mInputStream.close();
		save_str = save_str.replace(/^price=.*\w/gm,price_write);
		var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
		foStream.init(file, 0x02 | 0x20, 0660, null);
		foStream.write(save_str,save_str.length);
		foStream.close();
	}
}

function save_addres(){
	var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
	var check = {value: false};
	var input = {value: user_attr.address};
	var result = prompts.prompt(null, address_nvc, enter_address_nvc, input, null, check);
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
		var istream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
		istream.init(file, 0x01, 00660, null);
		var mInputStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
		mInputStream.init(istream);
		var save_str = mInputStream.read(mInputStream.available());
		istream.close();
		mInputStream.close();
		save_str = save_str.replace(/^addres+=.*\w/gm,address_write);
		var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
		foStream.init(file, 0x02 | 0x20, 0660, null);
		foStream.write(save_str,save_str.length);
		foStream.close();
	}
}

function save_eml(){
	var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
	var check = {value: false};
	var input = {value: ""};
	var result = prompts.prompt(null, address_eml, enter_address_eml, input, null, check);
	if(result){
		var input_eml = input.value.match(/\w[а-яА-Яa-z0-9A-Z-_.]*@[а-яА-Яa-z0-9A-Z-_.]*\w/g);
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
		var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
		foStream.init(file, 0x02 | 0x10, 0660, null);
		foStream.write(eml_write,eml_write.length);
		foStream.close();
	}
}

function save_check(id_name){
	request_posts = [];
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
		if(prof.path.match("/")){
			var slash = "/";
		}
		else{
			var slash = "\\";
		}
		file.initWithPath(prof.path + slash + "flag_save013.txt");
	var istream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
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

function save_sync(id_name){
	var sync__book = document.getElementById(id_name);
	if(sync_ch == "false"){
		sync_ch = "true";
		sync__book.setAttribute("checked", save_ch);
	}
	else{
		sync_ch = "false";
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
	var istream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
	istream.init(file, 0x01, 00660, null);
	var mInputStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
	mInputStream.init(istream);
	var save_str = mInputStream.read(mInputStream.available());
	istream.close();
	mInputStream.close();
	save_str = save_str.replace(/\wsyncAddrBook=.*\w/gm,("syncAddrBook=" + sync_ch));
	var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
	foStream.init(file, 0x02 | 0x20, 0660, null);
	foStream.write(save_str,save_str.length);
	foStream.close();
}




