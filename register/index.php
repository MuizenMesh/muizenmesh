<!DOCTYPE html>
<html>
  <head>
    <title>New Member Registration</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">
   <link rel="stylesheet" href="css/styles.css"> 
  </head>
  <body>
    <div class="testbox">
      <form name="form1" action="submit.php" method ="post" enctype="multipart/form-data" >
        <div class="banner">
          <h1>New Member Registration</h1>
        </div>
        <div class="colums">
          <div class="item">
            <label for="fname"> First Name<span>*</span></label>
            <input id="fname" type="text" name="fname" required/>
          </div>
          <div class="item">
            <label for="lname"> Last Name<span>*</span></label>
            <input id="lname" type="text" name="lname" required/>
          </div>
          <div class="item">
            <label for="address1">Address 1<span>*</span></label>
            <input id="address1" type="text"   name="address1" required/>
          </div>
          <div class="item">
            <label for="address2">Address 2<span>*</span></label>
            <input id="address2" type="text"   name="address2" required/>
          </div>
          <div class="item">
            <label for="state">State<span>*</span></label>
            <input id="state" type="text"   name="state" required/>
          </div>
          <div class="item">
            <label for="zip">Zip/Postal Code<span>*</span></label>
            <input id="zip" type="text" name="zip" required/>
          </div>
          <div class="item">
            <label for="city">City<span>*</span></label>
            <input id="city" type="text"   name="city" required/>
          </div>
          <div class="item">
            <label for="address">Email Address<span>*</span></label>
            <input id="address" type="text"   name="address" required/>
          </div>
          <div class="item">
            <label for="phone">Phone<span>*</span></label>
            <input id="phone" type="tel"   name="phone" required/>
          </div>
        </div>
        <div class="question">
          <label>Membership Type</label>
          <div class="question-answer">
            <div>
              <input type="radio" value="none" id="radio_1" name="std"/>
              <label for="radio_1" class="radio"><span>Standard</span></label>
            </div>
            <div>
              <input  type="radio" value="none" id="radio_2" name="sup"/>
              <label for="radio_2" class="radio"><span>Supporting</span></label>
            </div>
            <div>
              <input  type="radio" value="none" id="radio_3" name="don"/>
              <label for="radio_3" class="radio"><span>Donor</span></label>
            </div>
          </div>
        </div>
        <div class="question">
          <label>Preferred way to contact </label>
          <div class="question-answer">
            <div>
              <input type="radio" value="none" id="radio_4" name="cont1"/>
              <label for="radio_4" class="radio"><span>Phone</span></label>
            </div>
            <div>
              <input  type="radio" value="none" id="radio_5" name="cont2"/>
              <label for="radio_5" class="radio"><span>Email</span></label>
            </div>
            <div>
              <input  type="radio" value="none" id="radio_6" name="cont3"/>
              <label for="radio_6" class="radio"><span>Any</span></label>
            </div>
          </div>
        </div>
	<div class="question">
	<label>You have read our Constitution</label>
	<div classs="question-answer">
	<div>
	<input type="radio" value="none" id="radio_7" name="agree"/>
	<label for="radio_7" class="radio"><span>Yes</span></label>
	</div>
      </div>
    </div>
        <h2>Terms and Conditions</h2>
        <input type="checkbox" name="checkbox1">
        <label>You consent to our guidlines and constitution and will receive communications from us electronically. We will communicate with you by choice in communication. You agree that all agreements, notices, disclosures and other communications that we provide to you electronically satisfy any legal requirement that such communications be in writing.</label>
        <div class="btn-block">
          <button type="submit" href="/">Submit</button>
        </div>
      </form>
    </div>
  </body>
</html>
