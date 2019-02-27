import onTap from '/utils/aes';

Page({
  onLoad() {
  },
  data: {
    plainText: 'This is a plain text',
  },
  onTap() {
    onTap.apply(this, [this.data.plainText]);
  },
});
