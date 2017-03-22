(function(){
	const goingbuttons = document.getElementsByClassName('going');
	const guestsnumbers= document.getElementsByClassName('guests');
	const idlist = [];
	let currentLocation = window.location.host;
	const user = document.getElementById('userid').innerHTML;
	
	if(guestsnumbers.length > 0){
		for (let i = 0; i< guestsnumbers.length; i++){
			idlist.push(guestsnumbers[i].getAttribute('id').slice(0,-6));
		}

		let numberReq = new XMLHttpRequest();
		numberReq.onreadystatechange = function(){
			if (this.readyState == 4 && this.status == 200){
				let existingNumbers = JSON.parse(numberReq.response);
				existingNumbers.forEach(function(e){
					let el = document.getElementById(`${e[0]}guests`);
					if (e[1].includes(user)){
						el.parentNode.className += " user";
						el.innerHTML = (e[1].length==1) ? 'You are going' : e[1].length==2 ? `You and 1 other are going` : `You and ${e[1].length-1} others are going`;
					} else {
						if (el.parentNode.className.indexOf("user")>=0){
							el.parentNode.classList.remove("user");
						}
						el.innerHTML = e[1].length==1 ? '1 person is going' : `${e[1].length} people are going`;
					}
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
							// console.log(currentLocation);
							// window.location = currentLocation;
							let el = document.getElementById(`${id}guests`);
							let res = JSON.parse(goingReq.response);
							if (res.includes(user)) {
								el.parentNode.className += " user";
								el.innerHTML = res.length==1 ?'You are going' : res.length ==2? `You and 1 other are going` : `You and ${res.length-1} others are going`;
							} else {
								console.log("user is not going");
								if (el.parentNode.className.indexOf("user")>=0){
									el.parentNode.classList.remove("user");
								}
								el.innerHTML = res.length==1 ? '1 person is going' : `${res.length} people are going`;
							}
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