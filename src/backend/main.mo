import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Principal "mo:core/Principal";

actor {
  /// CONTACT FORM SUBMISSIONS
  type OrganizationType = {
    #farmer;
    #buyer;
    #investor;
    #FPO;
    #other;
  };

  type ContactSubmission = {
    id : Nat;
    name : Text;
    orgType : OrganizationType;
    email : Text;
    phone : Text;
    message : Text;
    timestamp : Int;
  };
  
  module ContactSubmission {
    public func compare(sub1 : ContactSubmission, sub2 : ContactSubmission) : Order.Order {
      Nat.compare(sub1.id, sub2.id);
    };
  };

  let submissions = Map.empty<Nat, ContactSubmission>();
  var nextId = 0;

  public shared ({ caller }) func submitContact(
    name : Text,
    orgType : OrganizationType,
    email : Text,
    phone : Text,
    message : Text,
  ) : async () {
    let submission : ContactSubmission = {
      id = nextId;
      name;
      orgType;
      email;
      phone;
      message;
      timestamp = 0;
    };

    submissions.add(nextId, submission);
    nextId += 1;
  };

  public query ({ caller }) func getAllSubmissions() : async [ContactSubmission] {
    submissions.values().toArray().sort();
  };

  public query ({ caller }) func getSubmission(id : Nat) : async ContactSubmission {
    switch (submissions.get(id)) {
      case (null) { Runtime.trap("Submission with ID " # id.toText() # " does not exist") };
      case (?submission) { submission };
    };
  };

  public shared ({ caller }) func deleteSubmission(id : Nat) : async () {
    switch (submissions.get(id)) {
      case (null) { Runtime.trap("Submission with ID " # id.toText() # " does not exist") };
      case (?_) {
        submissions.remove(id);
      };
    };
  };

  /// PAGE VISIT COUNTER
  var visitCount = 0;

  public shared ({ caller }) func incrementVisitCount() : async () {
    visitCount += 1;
  };

  public query ({ caller }) func getVisitCount() : async Nat {
    visitCount;
  };
};
