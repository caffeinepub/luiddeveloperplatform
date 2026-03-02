module {
  type OldActor = {};
  type NewActor = {
    usersArr : [(Nat, { id : Nat; username : Text; passwordHash : Text; email : Text; role : { #user; #admin }; isActive : Bool; createdAt : Int; purchasedProductIds : [Nat] })];
    productsArr : [(Nat, { id : Nat; name : Text; description : Text; version : Text; category : { #discordBots; #automationScripts; #aiTools; #apis }; priceOneTime : Float; priceSubscription : Float; fileId : ?Text; fileName : ?Text; fileSize : ?Nat; updatedAt : ?Int; updateNote : ?Text; versionHistory : [{ version : Text; note : ?Text; updatedAt : Int }]; isActive : Bool; createdAt : Int; rating : Float; reviewCount : Nat; tags : [Text] })];
    ordersArr : [(Nat, { id : Nat; userId : Nat; productId : Nat; orderType : { #oneTime; #subscription }; amount : Float; status : { #completed; #pending; #refunded }; createdAt : Int; licenseKey : Text })];
    licensesArr : [(Nat, { id : Nat; userId : Nat; productId : Nat; orderId : Nat; key : Text; isActive : Bool; expiresAt : ?Int; createdAt : Int })];
    nextUserId : Nat;
    nextProductId : Nat;
    nextOrderId : Nat;
    nextLicenseId : Nat;
    lastUpdated : Int;
    initialized : Bool;
  };

  public func run(_ : OldActor) : NewActor {
    {
      usersArr = [];
      productsArr = [];
      ordersArr = [];
      licensesArr = [];
      nextUserId = 1;
      nextProductId = 1;
      nextOrderId = 1;
      nextLicenseId = 1;
      lastUpdated = 0;
      initialized = false;
    };
  };
};
