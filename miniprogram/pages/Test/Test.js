const app = getApp();

Page({
  data: {
    formid:''
  },

  formSubmit(e) {
    this.requestNotification(e, 0)
  },

  requestNotification(e, templateType) {
    const formId = e.detail.formId;
    console.log(formId)
  }
})
