import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Float "mo:core/Float";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  stable var usersArr : [(Nat, User)] = [];
  stable var productsArr : [(Nat, Product)] = [];
  stable var ordersArr : [(Nat, Order)] = [];
  stable var licensesArr : [(Nat, License)] = [];
  stable var nextUserId : Nat = 1;
  stable var nextProductId : Nat = 1;
  stable var nextOrderId : Nat = 1;
  stable var nextLicenseId : Nat = 1;
  stable var initialized : Bool = false;
  stable var lastUpdated : Int = 0;

  public type UserRole = { #user; #admin };
  public type OrderType = { #oneTime; #subscription };
  public type Category = { #discordBots; #automationScripts; #aiTools; #apis };
  public type OrderStatus = { #completed; #pending; #refunded };

  public type VersionHistoryEntry = {
    version : Text;
    note : ?Text;
    updatedAt : Int;
  };

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

  transient var usersMap : Map.Map<Nat, User> = do {
    let m = Map.empty<Nat, User>();
    for ((k, v) in usersArr.vals()) { m.add(k, v) };
    m
  };

  transient var productsMap : Map.Map<Nat, Product> = do {
    let m = Map.empty<Nat, Product>();
    for ((k, v) in productsArr.vals()) { m.add(k, v) };
    m
  };

  transient var ordersMap : Map.Map<Nat, Order> = do {
    let m = Map.empty<Nat, Order>();
    for ((k, v) in ordersArr.vals()) { m.add(k, v) };
    m
  };

  transient var licensesMap : Map.Map<Nat, License> = do {
    let m = Map.empty<Nat, License>();
    for ((k, v) in licensesArr.vals()) { m.add(k, v) };
    m
  };

  func persistUsers() {
    let lst = List.empty<(Nat, User)>();
    usersMap.forEach(func(k, v) { lst.add((k, v)) });
    usersArr := lst.toArray();
  };

  func persistProducts() {
    let lst = List.empty<(Nat, Product)>();
    productsMap.forEach(func(k, v) { lst.add((k, v)) });
    productsArr := lst.toArray();
  };

  func persistOrders() {
    let lst = List.empty<(Nat, Order)>();
    ordersMap.forEach(func(k, v) { lst.add((k, v)) });
    ordersArr := lst.toArray();
  };

  func persistLicenses() {
    let lst = List.empty<(Nat, License)>();
    licensesMap.forEach(func(k, v) { lst.add((k, v)) });
    licensesArr := lst.toArray();
  };

  public shared func initialize() : async Bool {
    if (initialized) { return false };

    let adminUser : User = {
      id = nextUserId;
      username = "SidneiCosta00";
      email = "sidnei@luidcorporation.com";
      passwordHash = "7007c711";
      role = #admin;
      isActive = true;
      createdAt = Time.now();
      purchasedProductIds = [];
    };

    usersMap.add(nextUserId, adminUser);
    nextUserId += 1;

    let now = Time.now();

    let p1 : Product = {
      id = nextProductId;
      name = "LuidGuard Bot";
      description = "Bot avancado para moderacao e protecao de servidores Discord. Sistema anti-raid, filtros de spam e logs automaticos.";
      version = "2.4.1";
      category = #discordBots;
      priceOneTime = 49.99;
      priceSubscription = 12.99;
      fileId = null;
      fileName = null;
      fileSize = null;
      updatedAt = null;
      updateNote = null;
      versionHistory = [];
      isActive = true;
      createdAt = now;
      rating = 4.8;
      reviewCount = 142;
      tags = ["discord", "moderacao", "seguranca"];
    };

    let p2 : Product = {
      id = nextProductId + 1;
      name = "AutoTask Pro";
      description = "Script de automacao para tarefas repetitivas no Windows e Linux. Agendamento inteligente e relatorios detalhados.";
      version = "3.1.0";
      category = #automationScripts;
      priceOneTime = 79.99;
      priceSubscription = 19.99;
      fileId = null;
      fileName = null;
      fileSize = null;
      updatedAt = null;
      updateNote = null;
      versionHistory = [];
      isActive = true;
      createdAt = now;
      rating = 4.6;
      reviewCount = 89;
      tags = ["automacao", "windows", "linux"];
    };

    let p3 : Product = {
      id = nextProductId + 2;
      name = "LuidAI Assistant";
      description = "Ferramenta de IA para geracao de codigo e analise de dados. Integra com OpenAI e Anthropic.";
      version = "1.5.2";
      category = #aiTools;
      priceOneTime = 129.99;
      priceSubscription = 29.99;
      fileId = null;
      fileName = null;
      fileSize = null;
      updatedAt = null;
      updateNote = null;
      versionHistory = [];
      isActive = true;
      createdAt = now;
      rating = 4.9;
      reviewCount = 203;
      tags = ["ia", "gpt", "codigo"];
    };

    let p4 : Product = {
      id = nextProductId + 3;
      name = "RestBridge API";
      description = "Wrapper universal para APIs REST com autenticacao automatica, retry inteligente e documentacao OpenAPI.";
      version = "4.0.0";
      category = #apis;
      priceOneTime = 99.99;
      priceSubscription = 24.99;
      fileId = null;
      fileName = null;
      fileSize = null;
      updatedAt = null;
      updateNote = null;
      versionHistory = [];
      isActive = true;
      createdAt = now;
      rating = 4.7;
      reviewCount = 76;
      tags = ["api", "rest", "wrapper"];
    };

    let p5 : Product = {
      id = nextProductId + 4;
      name = "TicketMaster Bot";
      description = "Sistema completo de tickets para suporte no Discord com categorias, prioridades e historico de atendimento.";
      version = "1.8.0";
      category = #discordBots;
      priceOneTime = 39.99;
      priceSubscription = 9.99;
      fileId = null;
      fileName = null;
      fileSize = null;
      updatedAt = null;
      updateNote = null;
      versionHistory = [];
      isActive = true;
      createdAt = now;
      rating = 4.5;
      reviewCount = 118;
      tags = ["discord", "tickets", "suporte"];
    };

    let p6 : Product = {
      id = nextProductId + 5;
      name = "DataScraper Elite";
      description = "Script profissional de web scraping com proxies rotativos, deteccao de CAPTCHAs e exportacao para JSON e CSV.";
      version = "2.2.3";
      category = #automationScripts;
      priceOneTime = 89.99;
      priceSubscription = 22.99;
      fileId = null;
      fileName = null;
      fileSize = null;
      updatedAt = null;
      updateNote = null;
      versionHistory = [];
      isActive = true;
      createdAt = now;
      rating = 4.4;
      reviewCount = 61;
      tags = ["scraping", "dados", "web"];
    };

    productsMap.add(nextProductId, p1);
    productsMap.add(nextProductId + 1, p2);
    productsMap.add(nextProductId + 2, p3);
    productsMap.add(nextProductId + 3, p4);
    productsMap.add(nextProductId + 4, p5);
    productsMap.add(nextProductId + 5, p6);
    nextProductId += 6;

    initialized := true;
    persistUsers();
    persistProducts();
    true
  };

  public shared func login(username : Text, passwordHash : Text) : async { #ok : User; #err : Text } {
    var found : ?User = null;
    usersMap.forEach(func(_k, u) {
      if (u.username == username) { found := ?u }
    });
    switch (found) {
      case (null) { #err("Usuario nao encontrado.") };
      case (?u) {
        if (not u.isActive) { return #err("Conta desativada.") };
        if (u.passwordHash != passwordHash) { return #err("Senha incorreta.") };
        #ok(u)
      };
    }
  };

  public shared func register(username : Text, email : Text, passwordHash : Text) : async { #ok : User; #err : Text } {
    var exists = false;
    usersMap.forEach(func(_k, u) {
      if (u.username == username) { exists := true }
    });
    if (exists) { return #err("Nome de usuario ja em uso.") };

    var emailExists = false;
    usersMap.forEach(func(_k, u) {
      if (u.email == email) { emailExists := true }
    });
    if (emailExists) { return #err("E-mail ja cadastrado.") };

    let newUser : User = {
      id = nextUserId;
      username = username;
      email = email;
      passwordHash = passwordHash;
      role = #user;
      isActive = true;
      createdAt = Time.now();
      purchasedProductIds = [];
    };

    usersMap.add(nextUserId, newUser);
    nextUserId += 1;
    persistUsers();
    #ok(newUser)
  };

  public query func getUsers() : async [User] {
    let lst = List.empty<User>();
    usersMap.forEach(func(_k, v) { lst.add(v) });
    lst.toArray()
  };

  public shared func updateUser(
    id : Nat,
    isActive : ?Bool,
    email : ?Text,
    purchasedProductIds : ?[Nat],
  ) : async { #ok : User; #err : Text } {
    switch (usersMap.get(id)) {
      case (null) { #err("Usuario nao encontrado.") };
      case (?u) {
        let updated : User = {
          id = u.id;
          username = u.username;
          passwordHash = u.passwordHash;
          email = switch (email) { case (?e) e; case (null) u.email };
          role = u.role;
          isActive = switch (isActive) { case (?a) a; case (null) u.isActive };
          createdAt = u.createdAt;
          purchasedProductIds = switch (purchasedProductIds) {
            case (?ids) ids;
            case (null) u.purchasedProductIds;
          };
        };
        usersMap.add(id, updated);
        persistUsers();
        #ok(updated)
      };
    }
  };

  public shared func deleteUser(id : Nat) : async Bool {
    switch (usersMap.get(id)) {
      case (null) { false };
      case (?_u) {
        usersMap.remove(id);
        let orderIdsToDelete = List.empty<Nat>();
        ordersMap.forEach(func(k, o) {
          if (o.userId == id) { orderIdsToDelete.add(k) }
        });
        for (oid in orderIdsToDelete.values()) { ordersMap.remove(oid) };
        let licenseIdsToDelete = List.empty<Nat>();
        licensesMap.forEach(func(k, l) {
          if (l.userId == id) { licenseIdsToDelete.add(k) }
        });
        for (lid in licenseIdsToDelete.values()) { licensesMap.remove(lid) };
        persistUsers();
        persistOrders();
        persistLicenses();
        true
      };
    }
  };

  public query func getProducts() : async [Product] {
    let lst = List.empty<Product>();
    productsMap.forEach(func(_k, v) { lst.add(v) });
    lst.toArray()
  };

  public shared func addProduct(
    name : Text,
    description : Text,
    version : Text,
    category : Category,
    priceOneTime : Float,
    priceSubscription : Float,
    fileId : ?Text,
    fileName : ?Text,
    fileSize : ?Nat,
    tags : [Text],
  ) : async Product {
    let p : Product = {
      id = nextProductId;
      name = name;
      description = description;
      version = version;
      category = category;
      priceOneTime = priceOneTime;
      priceSubscription = priceSubscription;
      fileId = fileId;
      fileName = fileName;
      fileSize = fileSize;
      updatedAt = null;
      updateNote = null;
      versionHistory = [];
      isActive = true;
      createdAt = Time.now();
      rating = 0.0;
      reviewCount = 0;
      tags = tags;
    };
    productsMap.add(nextProductId, p);
    nextProductId += 1;
    persistProducts();
    p
  };

  public shared func updateProduct(
    id : Nat,
    name : ?Text,
    description : ?Text,
    version : ?Text,
    category : ?Category,
    priceOneTime : ?Float,
    priceSubscription : ?Float,
    fileId : ?Text,
    fileName : ?Text,
    fileSize : ?Nat,
    isActive : ?Bool,
    updateNote : ?Text,
    appendVersionHistory : ?VersionHistoryEntry,
  ) : async { #ok : Product; #err : Text } {
    switch (productsMap.get(id)) {
      case (null) { #err("Produto nao encontrado.") };
      case (?p) {
        let newHistory : [VersionHistoryEntry] = switch (appendVersionHistory) {
          case (null) { p.versionHistory };
          case (?entry) {
            let lst = List.empty<VersionHistoryEntry>();
            for (h in p.versionHistory.vals()) { lst.add(h) };
            lst.add(entry);
            lst.toArray()
          };
        };
        let nowOpt : ?Int = switch (appendVersionHistory) {
          case (null) {
            switch (updateNote) {
              case (null) { p.updatedAt };
              case (?_) { ?Time.now() };
            }
          };
          case (?_) { ?Time.now() };
        };
        let updated : Product = {
          id = p.id;
          name = switch (name) { case (?n) n; case (null) p.name };
          description = switch (description) { case (?d) d; case (null) p.description };
          version = switch (version) { case (?v) v; case (null) p.version };
          category = switch (category) { case (?c) c; case (null) p.category };
          priceOneTime = switch (priceOneTime) { case (?price) price; case (null) p.priceOneTime };
          priceSubscription = switch (priceSubscription) { case (?price) price; case (null) p.priceSubscription };
          fileId = switch (fileId) { case (?fid) ?fid; case (null) p.fileId };
          fileName = switch (fileName) { case (?fn) ?fn; case (null) p.fileName };
          fileSize = switch (fileSize) { case (?fs) ?fs; case (null) p.fileSize };
          updatedAt = nowOpt;
          updateNote = switch (updateNote) { case (?n) ?n; case (null) p.updateNote };
          versionHistory = newHistory;
          isActive = switch (isActive) { case (?a) a; case (null) p.isActive };
          createdAt = p.createdAt;
          rating = p.rating;
          reviewCount = p.reviewCount;
          tags = p.tags;
        };
        productsMap.add(id, updated);
        persistProducts();
        #ok(updated)
      };
    }
  };

  public shared func deleteProduct(id : Nat) : async Bool {
    switch (productsMap.get(id)) {
      case (null) { false };
      case (?_p) {
        productsMap.remove(id);
        persistProducts();
        true
      };
    }
  };

  public shared func toggleProductActive(id : Nat) : async { #ok : Product; #err : Text } {
    switch (productsMap.get(id)) {
      case (null) { #err("Produto nao encontrado.") };
      case (?p) {
        let updated : Product = { p with isActive = not p.isActive };
        productsMap.add(id, updated);
        persistProducts();
        #ok(updated)
      };
    }
  };

  public query func getOrders() : async [Order] {
    let lst = List.empty<Order>();
    ordersMap.forEach(func(_k, v) { lst.add(v) });
    lst.toArray()
  };

  public query func getOrdersByUser(userId : Nat) : async [Order] {
    let lst = List.empty<Order>();
    ordersMap.forEach(func(_k, o) {
      if (o.userId == userId) { lst.add(o) }
    });
    lst.toArray()
  };

  public shared func createOrder(
    userId : Nat,
    productId : Nat,
    orderType : OrderType,
    amount : Float,
    licenseKey : Text,
  ) : async Order {
    let o : Order = {
      id = nextOrderId;
      userId = userId;
      productId = productId;
      orderType = orderType;
      amount = amount;
      status = #completed;
      createdAt = Time.now();
      licenseKey = licenseKey;
    };
    ordersMap.add(nextOrderId, o);
    nextOrderId += 1;
    persistOrders();
    o
  };

  public query func getLicenses() : async [License] {
    let lst = List.empty<License>();
    licensesMap.forEach(func(_k, v) { lst.add(v) });
    lst.toArray()
  };

  public query func getLicensesByUser(userId : Nat) : async [License] {
    let lst = List.empty<License>();
    licensesMap.forEach(func(_k, l) {
      if (l.userId == userId) { lst.add(l) }
    });
    lst.toArray()
  };

  public shared func createLicense(
    userId : Nat,
    productId : Nat,
    orderId : Nat,
    key : Text,
    expiresAt : ?Int,
  ) : async License {
    let l : License = {
      id = nextLicenseId;
      userId = userId;
      productId = productId;
      orderId = orderId;
      key = key;
      isActive = true;
      expiresAt = expiresAt;
      createdAt = Time.now();
    };
    licensesMap.add(nextLicenseId, l);
    nextLicenseId += 1;
    persistLicenses();
    l
  };

  public shared func resetOrders() : async Bool {
    ordersMap.clear();
    licensesMap.clear();
    let updatedUsers = List.empty<(Nat, User)>();
    usersMap.forEach(func(k, u) {
      updatedUsers.add((k, { u with purchasedProductIds = [] }))
    });
    usersMap.clear();
    for ((k, u) in updatedUsers.values()) { usersMap.add(k, u) };
    persistOrders();
    persistLicenses();
    persistUsers();
    true
  };
};
