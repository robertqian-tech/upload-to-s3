var uploadPictures = {
	addCaptionModal: null,
	picCaptionTextarea: null,
	clonedPreview: null,
	
	params: {
		url: 'https://s3.amazonaws.com/s3-bucket-name',
		limitConcurrentUploads: 3,
		maxFileSize: 20000000, // 20 MB validate image size
		loadImageMaxFileSize: 20000000, // 20 MB preview image
		acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp)$/i, // validate image type
		loadImageFileTypes: /^image\/(gif|jpe?g|png|bmp)$/ // preview image
	},
	
	initFileupload: function(fp, customizedParams, sortableAndcaption) {
		var completeParams = jQuery.extend({}, this.params, customizedParams);
		fp.fileupload(completeParams);
		if(sortableAndcaption) {
			this.initSortable(customizedParams.filesContainer);
			this.initCaption(customizedParams.filesContainer);
		}
	},
	
	initSortable: function(filesContainer) {
		filesContainer.sortable({
			placeholder: 'ui-state-highlight',
			items: '.img-preview',
			handle: '.preview img',
			tolerance: 'pointer',
			distance: 10,
			revert: 250,
			scrollSensitivity: 100,
			scrollSpeed: 5
		});
	},
	
	initCaption: function(filesContainer) {
		this.addCaptionModal = $('#addCaptionModal');
		this.picCaptionTextarea = $('#picCaptionTextarea');
		this.clonedPreview = $('#clonedPreview');
		var that = this;
		filesContainer.on('previewLoaded', '.template-upload', function() {
			var previewContainer = $(this).children('.preview');
			previewContainer.children('.fa-pencil').click(function(){that.openAddCaptionModal(previewContainer);});
		});
		this.addCaptionModal.find('button.submit-btn').click($.proxy(this.addImageCaption, this));
		$(document).on('closed.fndtn.reveal', '#addCaptionModal', function () {
			that.clonedPreview.empty();
			that.picCaptionTextarea.val('');
			that.updateAutosize();
		});
		$(document).on('opened.fndtn.reveal', '#addCaptionModal', function () {
			that.updateAutosize();
		});
	},
	
	openAddCaptionModal: function(previewContainer) {
		this.addCaptionModal.foundation('reveal', 'open');
		var clonedPreview = previewContainer.clone();
		clonedPreview.children('a, .progress, input').remove();
		this.clonedPreview.html(clonedPreview);
		this.picCaptionTextarea.val(previewContainer.children('input[name="pictureCaptions[]"]').val());
		this.addCaptionModal.data('previewContainer', previewContainer);
	},
	
	addImageCaption: function() {
		var caption = $.trim(this.picCaptionTextarea.val());
		this.addCaptionModal.data('previewContainer').children('input[name="pictureCaptions[]"]').val(caption);
		this.addCaptionModal.foundation('reveal', 'close');
	},
	
	updateAutosize: function() {
		var ta = document.querySelector('#picCaptionTextarea');
		// Dispatch a 'autosize.update' event to trigger a resize:
		var evt = document.createEvent('Event');
		evt.initEvent('autosize.update', true, false);
		ta.dispatchEvent(evt);
	}
};
