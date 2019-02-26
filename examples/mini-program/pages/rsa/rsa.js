import onTap from '/utils/rsa';

Page({

  data: {
    plainText: 'This is a plain text',
  },
  onTap() {
    onTap.apply(this, [this.data.plainText]);
  },
});
