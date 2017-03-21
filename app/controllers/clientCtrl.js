(function(){
	const goingbuttons = document.getElementsByClassName('going');
	const guestsnumbers= document.getElementsByClassName('guests');
	const idlist = [];
	let currentLocation = window.location.host;
	
	if(guestsnumbers.length > 0){
		for (let i = 0; i< guestsnumbers.length; i++){
			idlist.push(guestsnumbers[i].getAttribute('id').slice(0,-6));
		}
		console.log(idlist);

		let numberReq = new XMLHttpRequest();
		numberReq.onreadystatechange = function(){
			if (this.readyState == 4 && this.status == 200){
				let existingNumbers = JSON.parse(numberReq.response);
				existingNumbers.forEach(function(e){
					document.getElementById(`${e[0]}guests`).innerHTML = e[1];
				});
			}
		}

		numberReq.open('POST', `/api/venues`, true);
		numberReq.setRequestHeader("Content-Type", "application/json");
		numberReq.send(JSON.stringify(idlist));
	}

	for (let i=0; i<goingbuttons.length; i++){

		goingbuttons[i].addEventListener('click', function(e){
			e.preventDefault();
			let id = e.target.getAttribute('id').slice(0,-6);

			let loggedinReq = new XMLHttpRequest();
			loggedinReq.onreadystatechange = function(){
				if (this.readyState == 4 && this.status == 200){
					let goingReq = new XMLHttpRequest();
					goingReq.onreadystatechange = function(){
						if (this.readyState == 4 && this.status == 200){
							window.location = currentLocation;
							let numberOfGuests = document.getElementById(`${id}guests`);
							console.log(goingReq.response);
							numberOfGuests.innerHTML = goingReq.response;
						}
					}
					goingReq.open('PUT', `/api/venue/${id}`, true);
					goingReq.send();
				} else if (this.status == 504) {
					document.getElementById('fblogin').click();
				}
			}
			loggedinReq.open('GET', '/api/loggedin', true);
			loggedinReq.send();
		});
	} 
})();