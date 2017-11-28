$(document).on("click", "a", function(e){
	e.preventDefault();
});


	function Contact(name, email, phone, id) {
		this.name = name;
		this.email = email;
		this.phone = phone;
		this.id = id;
	};

	function App(){
		this.contactList = [];
		this.lastId = 0;
		this.init();
		this.searchTerm = '';
	};

	App.prototype = {
		bindEvents: function() {
				var self = this;
				$("#add-button").on("click", function(e){
					$("#contacts").slideUp(500);
					$(".settings-row").slideUp(500);
				});

				$("#cancel").on("click", function(e){
					self.showContactList();
					$('.settings-row').slideDown(500);
				});

				$("#add-form").on("submit", function(e){
					e.preventDefault();
					var input = [];
					$(this).find(":input").each(function(idx, inp){
						input.push($(inp).val());
					});
					self.add.apply(self, input);
					self.showContactList();
					$('.settings-row').slideDown(500);

				});

				$(document).on("click", "#delete", function(e){
					var id = +$(this).attr("data-id");
					self.deleteFromContacts(id);
				})
				$("#search").on("keyup", function(e){
					var new_contacts = [];
					


					var terms = $(this).val().match(/[a-zA-z]/ig);

					if (terms){
						self.searchTerm = terms.join('');
					} else {
						self.searchTerm = '';
					}

					console.log(self.searchTerm);
					self.search();

				})
		},
		search: function() {
			var term = new RegExp(this.searchTerm, 'i');
			if (term === '') {
				this.updateContactView(this.contactList);
			} else {
				var new_list = this.contactList.filter(function(contact){
					return contact.name.match(term);
				})
				this.updateContactView(new_list);
			};
		},
		add: function(name, email, phone){
			var contact = new Contact(name, email, phone, this.lastId+1);
			this.lastId += 1;
			this.contactList.push(contact);
			this.showContactList();
			this.saveToLocalStorage();
		},

		showContactList: function() {
			$("#contacts").slideDown(500);
		},
		updateContactView: function(arrayOfContacts) {
			var html = this.renderContacts({contacts: arrayOfContacts});
			$("#contacts").html(html);
		},
		saveToLocalStorage: function() {
			window.localStorage.setItem('contactList', JSON.stringify(this.contactList));
			this.updateContactView(this.contactList);
		},
		loadFromLocalStorage: function() {
			var contactList = JSON.parse(window.localStorage.getItem('contactList')) || [];
			this.contactList = contactList;
			this.updateContactView(this.contactList);
		},
		registerTemplates: function() {
			var partial = $("#contact").html();
			Handlebars.registerPartial('contact', partial);
			var template = $("#contact-list").html();
			this.renderContacts = Handlebars.compile(template);
		},
		deleteFromContacts: function(id) {
			for (var i = 0; i < this.contactList.length; i++){
				if (this.contactList[i].id === id) {
					this.contactList.splice(i, 1);
				}
			};
			this.saveToLocalStorage();
		},
		init: function() {
			this.bindEvents();
			this.registerTemplates();
			this.loadFromLocalStorage();
		}

	};


$(function(){
	var app = new App();
})
