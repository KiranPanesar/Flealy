Flealy
======

An online shopping platform by Kiran Panesar at Cardiff University (coursework piece for CM1102)

The problem we have today is that we know the best places to go by using services like Yelp, but how do you find the absolute best cappuccino in your city? That's where Flealy comes in. 

Flealy displays and ranks items listed nearby. A small business - whether it be a restaurant, coffee house or bar - would sign up and list the items that they offer. Users would then be able to see all the items on a map and find the best one closest to them. Flealy also features integration with [Stripe](http://stripe.com/) to handle payments.

Database dump
------
I added a database dump in commit [708d9bd](https://github.com/KiranPanesar/Flealy/commit/708d9bda575bf61679085357c50d8f8cc4dd4efd). Just import this into your phpMyAdmin (or whatever tool you're using) and then update the database connector in the /api/api.php file ([this function](https://github.com/KiranPanesar/Flealy/blob/master/api/api.php#L145)). Google around or [email me](mailto:kiransinghpanesar@googlemail.com) if you get stuck.

Restrictions
------
Restrictions for this project are
* Must be a shopping platform
* Can't use **any** third party frameworks
* Must use PHP
