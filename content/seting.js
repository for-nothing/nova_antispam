window.addEventListener("load",function(){ 
	var set_price = document.getElementById("setnvcPrice");
	set_price.addEventListener("click",function(){
		save_price();
	},false);
	var set__price = document.getElementById("set_nvcPrice");
	set__price.addEventListener("click",function(){
		save_price();
	},false);
	var set_addres = document.getElementById("setnvcAddres");
	set_addres.addEventListener("click",function(){
		save_addres();
	},false);
	var set__addres = document.getElementById("set_nvcAddres");
	set__addres.addEventListener("click",function(){
		save_addres();
	},false);
	var add_eml = document.getElementById("addToWhiteList");
	add_eml.addEventListener("click",function(){
		save_eml();
	},false);
	var add__eml = document.getElementById("add_ToWhiteList");
	add__eml.addEventListener("click",function(){
		save_eml();
	},false);
}, false);

function save_price(){
	var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);
	var check = {value: false};
	var input = {value: price};
	var result = prompts.prompt(null, "количество nvc", "Введите требуемое количество nvc", input, null, check);
	if(result){
		price = input.value.replace(",",".");
		var price_write = "price=" + price ;
		var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		var prof = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
		file.initWithPath(prof.path + "\\extensions\\user_save.txt");
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
	var input = {value: user_attr.addres};
	var result = prompts.prompt(null, "адрес nvc", "Введите адрес nvc", input, null, check);
	if(result){
		user_attr.addres = input.value;
		var addres_write = "addres=" + user_attr.addres ;
		var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		var prof = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
		file.initWithPath(prof.path + "\\extensions\\user_save.txt");
		var istream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
		istream.init(file, 0x01, 00660, null);
		var mInputStream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
		mInputStream.init(istream);
		var save_str = mInputStream.read(mInputStream.available());
		istream.close();
		mInputStream.close();
		save_str = save_str.replace(/^addres=.*\w/gm,addres_write);
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
	var result = prompts.prompt(null, "адрес email", "Введите адрес email(вы можете ввести несколько адресов,разделяя их пробелом", input, null, check);
	if(result){
		var input_eml = input.value.match(/\w[а-яА-Яa-z0-9A-Z-_.]*@[а-яА-Яa-z0-9A-Z-_.]*\w/g);
		white_list = white_list.concat(input_eml);
		var eml_write = input_eml.join("\r\n");
		var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		var prof = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
		file.initWithPath(prof.path + "\\extensions\\user_save.txt");
		var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
		foStream.init(file, 0x02 | 0x10, 0660, null);
		foStream.write(eml_write,eml_write.length);
		foStream.close();
	}
}
