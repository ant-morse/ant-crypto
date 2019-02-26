import onTap from '/utils/hmac';

Page({

  data: {
    plainText: 'This is a plain text',
  },
  onTap() {
    onTap.apply(this, [this.data.plainText]);
  },
});
