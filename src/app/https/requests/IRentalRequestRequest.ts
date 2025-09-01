interface IAddRentalRequest {
  rental_item_id: number;
  customer_name: string;
  start_time: string;
  end_time: string;
  status: string;
}

export {IAddRentalRequest};
