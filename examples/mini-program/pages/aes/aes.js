import onTap from '/utils/aes';

Page({
  onLoad() {
    // my.alert({ title: `typeof crypto`, content: typeof crypto })
    // my.alert({ title: `typeof getRandomValues`, content: typeof getRandomValues })
  },
  data: {
    plainText: 'This is a plain text',
  },
  onTap() {
    onTap.apply(this, [this.data.plainText]);
  },
});
