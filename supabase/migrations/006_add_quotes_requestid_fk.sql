alter table quotes
  add constraint quotes_requestid_fkey foreign key (requestId) references requests(id) on delete cascade; 