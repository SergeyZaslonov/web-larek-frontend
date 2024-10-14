import { API_URL, CDN_URL } from './utils/constants';
import { ApiLarek } from './components/apiLarek';
import { EventEmitter } from './components/base/events';
import { LarekModel } from './components/modelLarek';
import { Page } from './components/page';
import { Modal } from './components/base/Modal';

import './scss/styles.scss';
import { Card } from './components/card';
import { cloneTemplate } from './utils/utils';
import { IProduct, IOrderInfo, IOrderResult } from './types';
import { Basket } from './components/basket';
import { Order } from './components/order';
import { Contacts } from './components/contacts';
import { Success } from './components/success';

const cardCatalogTemplate = document.body.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.body.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.body.querySelector('#basket') as HTMLTemplateElement;;
const orderTemplate = document.body.querySelector('#order') as HTMLTemplateElement;;
const contactsTemplate = document.body.querySelector('#contacts') as HTMLTemplateElement;;
const successTemplate = document.body.querySelector('#success') as HTMLTemplateElement;;

let modalForm: Order | Contacts;

const events=new EventEmitter();
const model=new LarekModel(events);
const api=new ApiLarek(API_URL, CDN_URL);

const page = new Page(document.body, events);
const modal = new Modal(document.body.querySelector('#modal-container'), events);

api.getProductsList()
  .then((items) => {
    model.catalog=items;
  })
  .catch((err) => {
    console.error(err);
  });

// ******************************************************

events.on('catalog:changed', () => {
  const cards = model.catalog.map((item) => {
    const card = new Card(cloneTemplate(cardCatalogTemplate));
    card.onClick = () => events.emit('card:select', {...item});
    return card.render(item);
  });

  page.items = cards;
  page.basketCount = model.basketCount;
});

events.on('card:select',(item: IProduct) => {
  const card = new Card(cloneTemplate(cardPreviewTemplate));
  if (model.productInBasket(item.id)) {
    card.buttonText = 'Удалить';
    card.onClick = () => {
      events.emit('product:remove', {id: item.id });
      modal.close()
    }
  } 
  else 
    card.onClick = () => {
      events.emit('product:add', {id:item.id});
      modal.close()
    }
  modal.render(
    {content: card.render(item)}
  );
});

events.on('product:add', ({id}:{id: string}) => {
  model.addToBasket(id);
});

events.on('product:remove', ({id}:{id: string}) => {
  model.removeFromBasket(id);
});

events.on('basket:changed', () => {
  page.basketCount = model.basketCount;
});

events.on('basket:open', () => {
  const basketForm = new Basket(cloneTemplate(basketTemplate),events);
  modal.render({content: basketForm.render(model.basket)})
})

events.on('basket:refresh', (basketForm: Basket) => {
  modal.render({content: basketForm.render(model.basket)})
});

events.on('order:open', () => {
  modalForm = new Order(cloneTemplate(orderTemplate), events);
  modal.render({
    content: modalForm.render({
      payment: model.order.payment,
      address: model.order.address,
      valid: model.checkPaymentMethodAndAddress(),
      errors: [model.formErrors],
    }),
  });
});

events.on('order:next', () => {
  modalForm = new Contacts(cloneTemplate(contactsTemplate), events);
  modal.render({
    content: modalForm.render({
      phone: model.order.phone,
      email: model.order.email,
      valid: model.checkEmailAndPhone(),
      errors: [model.formErrors],
    }),
  });
});

events.on('order:submit', () => {
  modal.close();
  api.putOrder(model.order)
  .then((result: IOrderResult) => {
    model.clearBasket();
    const success = new Success(cloneTemplate(successTemplate), result.total, events);
    modal.render(
      {content: success.render()}
    )  
  })
  .catch((err) => {
    console.error(err);
  });
});

events.on('order:finish', () => {
  modal.close();
});


events.on(/^order\.\w*:change/,(data: {field: keyof IOrderInfo, value: string}) => {
  model.setOrderField(data.field,data.value);
  modalForm.valid = model.checkPaymentMethodAndAddress();
  modalForm.errors = model.formErrors;
})

events.on(/^contacts\.\w*:change/,(data: {field: keyof IOrderInfo, value: string}) => {
  model.setOrderField(data.field,data.value);
  modalForm.valid = model.checkEmailAndPhone();
  modalForm.errors = model.formErrors;
})

events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});
