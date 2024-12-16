class BillInfo {
    #customerId;
    #customerName;
    #customerTelephone;
    #customerEmail;
    #billId;
  
    constructor({
      customerId,
      customerName,
      customerTelephone,
      customerEmail,
      billId
    }) {
      this.#customerId = customerId;
      this.#customerName = customerName;
      this.#customerTelephone = customerTelephone;
      this.#customerEmail = customerEmail;
      this.#billId = billId;
    }
  
    get customerId() { return this.#customerId; }
    get customerName() { return this.#customerName; }
    get customerTelephone() { return this.#customerTelephone; }
    get customerEmail() { return this.#customerEmail; }
    get billId() { return this.#billId; }
  
    static fromData(bill, customer) {
      return new BillInfo({
        customerId: customer.id,
        customerName: `${customer.name} ${customer.surname}`,
        customerTelephone: customer.telephone,
        customerEmail: customer.email,
        billId: bill.id
      });
    }
  }
  
  export default BillInfo;