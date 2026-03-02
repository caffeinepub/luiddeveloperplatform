import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import List "mo:core/List";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  // Stable arrays for persistent storage
  stable var usersArr : [(Nat, User)] = [];
  stable var productsArr : [(Nat, Product)] = [];
  stable var ordersArr : [(Nat, Order)] = [];
  stable var licensesArr : [(Nat, License)] = [];

  var nextUserId = 1;
  var nextProductId = 1;
  var nextOrderId = 1;
  var nextLicenseId = 1;
  var lastUpdated = Time.now();
  var initialized = false;

  public type UserRole = { #user; #admin };
  public type OrderType = { #oneTime; #subscription };
  public type Category = { #discordBots; #automationScripts; #aiTools; #apis };
  public type OrderStatus = { #completed; #pending; #refunded };

  public type VersionHistoryEntry = { version : Text; note : ?Text; updatedAt : Int };

  public type User = {
    id : Nat;
    username : Text;
    passwordHash : Text;
    email : Text;
    role : UserRole;
    isActive : Bool;
    createdAt : Int;
    purchasedProductIds : [Nat];
  };

  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    version : Text;
    category : Category;
    priceOneTime : Float;
    priceSubscription : Float;
    fileId : ?Text;
    fileName : ?Text;
    fileSize : ?Nat;
    updatedAt : ?Int;
    updateNote : ?Text;
    versionHistory : [VersionHistoryEntry];
    isActive : Bool;
    createdAt : Int;
    rating : Float;
    reviewCount : Nat;
    tags : [Text];
  };

  public type Order = {
    id : Nat;
    userId : Nat;
    productId : Nat;
    orderType : OrderType;
    amount : Float;
    status : OrderStatus;
    createdAt : Int;
    licenseKey : Text;
  };

  public type License = {
    id : Nat;
    userId : Nat;
    productId : Nat;
    orderId : Nat;
    key : Text;
    isActive : Bool;
    expiresAt : ?Int;
    createdAt : Int;
  };

  // Helper function to persist users array to stable storage
  func persistUsers(users : Map.Map<Nat, User>) {
    let usersList = List.empty<(Nat, User)>();
    users.forEach(func(k, v) { usersList.add((k, v)) });
    usersArr := usersList.reverse().toArray();
  };

  // Helper function to persist products array to stable storage
  func persistProducts(products : Map.Map<Nat, Product>) {
    let productsList = List.empty<(Nat, Product)>();
    products.forEach(func(k, v) { productsList.add((k, v)) });
    productsArr := productsList.reverse().toArray();
  };

  // Helper function to persist orders array to stable storage
  func persistOrders(orders : Map.Map<Nat, Order>) {
    let ordersList = List.empty<(Nat, Order)>();
    orders.forEach(func(k, v) { ordersList.add((k, v)) });
    ordersArr := ordersList.reverse().toArray();
  };

  // Helper function to persist licenses array to stable storage
  func persistLicenses(licenses : Map.Map<Nat, License>) {
    let licensesList = List.empty<(Nat, License)>();
    licenses.forEach(func(k, v) { licensesList.add((k, v)) });
    licensesArr := licensesList.reverse().toArray();
  };

  // Function to seed initial data if not initialized
  public shared ({ caller }) func initialize() : async Bool {
    if (initialized) { return false };

    // Admin user
    let adminUser : User = {
      id = nextUserId;
      username = "SidneiCosta00";
      email = "sidnei@example.com";
      passwordHash = ""; // To be migrated by frontend
      role = #admin;
      isActive = true;
      createdAt = Time.now();
      purchasedProductIds = [];
    };

    // Sample products
    let p1 : Product = {
      id = nextProductId;
      name = "Discord Helper";
      description = "A bot to manage discord servers";
      version = "1.0.0";
      category = #discordBots;
      priceOneTime = 9.99;
      priceSubscription = 2.99;
      fileId = null;
      fileName = null;
      fileSize = null;
      updatedAt = null;
      updateNote = null;
      versionHistory = [];
      isActive = true;
      createdAt = Time.now();
      rating = 0.0;
      reviewCount = 0;
      tags = ["bot", "discord", "server"];
    };

    let p2 : Product = { p1 with id = (nextProductId + 1); name = "Automation Script"; category = #automationScripts };
    let p3 : Product = { p1 with id = (nextProductId + 2); name = "AI Chat"; category = #aiTools };
    let p4 : Product = { p1 with id = (nextProductId + 3); name = "API Wrapper"; category = #apis };

    let usersMap = Map.empty<Nat, User>();
    let productsMap = Map.empty<Nat, Product>();

    usersMap.add(nextUserId, adminUser);
    productsMap.add(nextProductId, p1);
    productsMap.add((nextProductId + 1), p2);
    productsMap.add((nextProductId + 2), p3);
    productsMap.add((nextProductId + 3), p4);

    nextUserId += 1;
    nextProductId += 4;
    initialized := true;

    persistUsers(usersMap);
    persistProducts(productsMap);

    true;
  };
};
