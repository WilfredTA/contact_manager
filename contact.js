$(document).on("click", "a", function(e){
	e.preventDefault();
});


	function Contact(name, email, phone, tags, id) {
		this.name = name || '';
		this.email = email || '';
		this.phone = phone || '';
		this.id = id;
		this.tags = tags || [];
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
					self.lastId += 1;
					var contact = new Contact('','','', [], self.lastId)
					$("#contacts").slideUp(500);
					$(".settings-row").slideUp(500);
					
						$('main').append(self.renderForm(contact));
						$('.form').addClass("add-form");
						setTimeout(function(){
							$('.form-container').fadeIn(500);
						}, 900)

				});

				$(document).on("click",".cancel", function(e){
					self.showContactList();
					self.removeForms();
					$('.settings-row').slideDown(500);
				});

				$(document).on("submit", '.add-form', function(e){
					e.preventDefault();
					var input = [];
					$(this).find(":input").each(function(idx, inp){
						input.push($(inp).val());
					});
					console.log(input)
					self.add.apply(self, input);
					self.showContactList();
					$('.settings-row').slideDown(500);
					self.removeForms();
					

				});

				$(document).on("click", ".delete", function(e){
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

					self.search();

				});
				$(document).on("click", '.edit', function(e){
					var id = +$(this).attr('data-id');
					var contact = self.getContact(id);
					
					

					$('main').append(self.renderForm(contact));
					$('.form').addClass('edit-form');
					$("#contacts").slideUp(500);
					$(".settings-row").slideUp(500);
					setTimeout(function(){
							$('.form-container').fadeIn(500);
					}, 900)
					
				});

				$(document).on("submit", ".edit-form", function(e){
					e.preventDefault();
					var input = [];
					$(this).find(":input").each(function(idx, inp){
						input.push($(inp).val());
					});
					self.updateContact.apply(self, input)
					self.showContactList();
					$('.settings-row').slideDown(500);
					self.removeForms();

				})
		},
		getContact: function(id){
			return this.contactList.filter(function(contact){
				return contact.id === id;
			})[0];
		},
		updateContact: function(name, email, phone, tags, id){
			id = +id;
			tags = tags.split(',')
			var contact = new Contact(name, email, phone, tags, id);
			console.log(contact)
			this.contactList.forEach(function(el, idx){
				if (el.id === contact.id){
					this.contactList[idx] = contact;
				}
			}, this);
			this.saveToLocalStorage();
		},
		search: function() {
			console.log(this.contactList)
			var term = new RegExp(this.searchTerm, 'i');
			if (term === '') {
				this.updateContactView(this.contactList);
			} else {
				var new_list = this.contactList.filter(function(contact){
					return contact.name.match(term) || contact.tags.join('').match(term);
				})
				this.updateContactView(new_list);
			};
		},
		add: function(name, email, phone, tags, id){
			id = +id;
			tags = tags.split(',')
			var contact = new Contact(name, email, phone, tags, id);
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
			this.updateLastId();
			this.updateContactView(this.contactList);
		},
		updateLastId: function() {
			if (this.contactList.length){
				this.lastId = +this.contactList[this.contactList.length-1].id || 0;
			};
		},
		registerTemplates: function() {
			var partial = $("#contact").html();
			Handlebars.registerPartial('contact', partial);
			var contact_template = $("#contact-list").html();
			this.renderContacts = Handlebars.compile(contact_template);
			var form_template = $("#form-template").html();
			this.renderForm = Handlebars.compile(form_template);
			var tag_partial = $("#tag-partial").html();
			Handlebars.registerPartial('tag', tag_partial);
		},
		deleteFromContacts: function(id) {
			for (var i = 0; i < this.contactList.length; i++){
				if (this.contactList[i].id === id) {
					this.contactList.splice(i, 1);
				}
			};
			this.saveToLocalStorage();
		},
		removeForms: function() {
			$('.form-container:visible').remove();
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
