import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { ApiLarek } from './components/apiLarek';
import { EventEmitter } from './components/base/events';
import { LarekModel } from './components/modelLarek';
import { Page } from './components/page';
import { Modal } from './components/base/Modal';

import { BasketCard, Card } from './components/card';
import { cloneTemplate } from './utils/utils';
import { IProduct, IOrderInfo, IOrderResult, IBasketView } from './types';
import { Basket } from './components/basket';
import { Order } from './components/order';
import { Contacts } from './components/contacts';
import { Success } from './components/success';

const cardCatalogTemplate = document.body.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.body.querySelector('#card-preview') as HTMLTemplateElement;
const basketTemplate = document.body.querySelector('#basket') as HTMLTemplateElement;;
const cardBasketTemplate = document.body.querySelector('#card-basket') as HTMLTemplateElement;
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

events.on('basket:open', (basketForm: Basket) => {
  if (!basketForm)
    basketForm = new Basket(cloneTemplate(basketTemplate),events);
  const basket: IBasketView = {
    items: model.catalog.filter((item) => {
      return model.productInBasket(item.id)
      })
      .map((item, index) => {
        const card = new BasketCard(cloneTemplate(cardBasketTemplate));
        card.setIndex(index+1);
        card.onClick = () =>
          {
            events.emit('product:remove', { id: item.id });
            events.emit('basket:open', basketForm);
          };
        return card.render(item);
      }),
    total: model.basketTotal
  }
  modal.render({content: basketForm.render(basket)})
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

events.on('order:submit', () => {
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

events.on('contacts:submit', () => {
  api.putOrder(model.order)
  .then((result: IOrderResult) => {
    modal.close();
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
