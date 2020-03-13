//
var master = (function() {
    var apiUrl = 'https://api.open5e.com/'

    var counter = 1
    var allData = []
    var loading = '0%'

    function animateCSS(element, animationName, callback) {
        const node = document.querySelector(element)
        node.classList.add('animated', animationName)
    
        function handleAnimationEnd() {
            node.classList.remove('animated', animationName)
            node.removeEventListener('animationend', handleAnimationEnd)
    
            if (typeof callback === 'function') callback()
        }
    
        node.addEventListener('animationend', handleAnimationEnd)
    }

    function eventListener() {
            $('.navBtn').on('click', function() {
                hideNavMenu() 
            })
            navbtn = document.querySelector('.navBtn')
            navbtnSpan = document.querySelector('.navbar-toggler-icon')
            window.addEventListener('click', function(e) { 
                if (!$('.menuBtnList').hasClass('d-none') && e.target != navbtn && e.target != navbtnSpan) {
                    hideNavMenu()
                }
            })

            $('.startApp').on('click', function(click) {
                $('.startApp').unbind()
                $('.landing').hide()
                $('.startApp').removeClass('d-block')
                $('.startApp').addClass('d-none')
                $('.initText').removeClass('d-block')
                $('.initText').addClass('d-none')
                $(".loadingWrapper").removeClass('d-none')
                $(".loadingWrapper").addClass('animated zoomIn')
                $('.progress').removeClass('invisible')
                $('.loadingMenu').removeClass('invisible')
                
                if (!$('.menuBtnList').hasClass('d-none')) {
                    hideNavMenu()
                }
                loadingProgress(10)
                initalizeApi()
            })
    }

    function loadingProgress(number) {
        const loadingText = ["Loading...", "I really like loading bars",  
        "Did you know the unicorn is the national animal of Scotland.", "Almost done... I think?",];

            var a = parseInt(loading)
            var b = a + number
            var c = b.toString()
            var d = (c + '%')
            loading = d
            $('.progress-bar').width(loading)
            $(".loadText").text(loadingText[counter-1]);
            if (loading === "100%") {
                setTimeout(function(){
                    addMenuListeners()
                    $(".loadingWrapper").removeClass('zoomIn')
                    animateCSS('.loadingWrapper', 'zoomOut', function() {
                        $('.loadingWrapper').addClass('d-none')
                        $('.navbtncont').removeClass('invisible')
                        $('.menuBtns').removeClass('invisible')
                        $('.loadingMenu').addClass('invisible')
                        $('.landingComplete').removeClass('d-none')
                        $('.alert').removeClass('d-none')
                        $('.pointer').removeClass('d-none')
                        animateCSS('.alert', 'fadeInDown', function() {
                            setTimeout(function(){
                                animateCSS('.alert', 'fadeOutUp', function() {
                                    $('.alert').addClass('d-none')
                                    pointingLoad()
                                })
                            }, 2000);
                        })
                        console.log(allData)
                    })
                    searchListener()
                    
                }, 1000);
                
                
            }
    }   

    function pointingLoad() {
        
    }


    function addMenuListeners() {
        var smallSize = window.matchMedia("(max-width: 500px)")
        window.addEventListener('scroll', function() {
            scrollNav()
        })
        var a = document.querySelector('.searchbar')
        $('.menuBtns').on('click', function() {
            a.value = ''
            showAll()
            $('.landing').hide()
            $('.menuBtns').removeClass('active')
            $('.gridList').addClass('d-none')
            $('.completed').addClass('d-none')
            $('.searchbar').removeClass('monst')
            $('.searchbar').removeClass('spel')
            $('.searchbar').removeClass('clas')
            $('.searchbar').removeClass('mgcit') 
            $('.pointer').addClass('d-none')
            $('.landingComplete').addClass('d-none')
            $('.searchButton').removeClass('d-none') 
            $("footer").css('position', 'static')

        })


        $('.homeBtn').on('click', function() {
            $('.homeBtn').addClass('active')
            $('#searchBarToggle').removeClass('show')
            $('.landing').show()
            $('.searchButton').addClass('invisible') 
            $("footer").css('position', 'absolute')
            hideNavMenu()
            

        })
    
        $('.monstersbtn').on('click', function() {
            $('.monstersbtn').addClass('active')
            $('.monsterGrid').removeClass('d-none')
            $('.searchbar').addClass('monst')
            hideNavMenu()
            

        })
        $('.spellsbtn').on('click', function() {
            $('.spellsbtn').addClass('active')
            $('.spellGrid').removeClass('d-none')
            $('.searchbar').addClass('spel')
            hideNavMenu()
        })
        $('.classesbtn').on('click', function() {
            $('.classesbtn').addClass('active')
            $('.classGrid').removeClass('d-none')
            $('.searchbar').addClass('clas')
            if (!smallSize.matches) {
                $("footer").css('position', 'absolute')
            }
            hideNavMenu()
        })
        $('.magicitemsbtn').on('click', function() {
            $('.magicitemsbtn').addClass('active')
            $('.magicItemGrid').removeClass('d-none')
            $('.searchbar').addClass('mgcit')
            hideNavMenu()
        })
        
    }

    function scrollNav() {
        var smallSize = window.matchMedia("(max-width: 500px)")

        if (smallSize.matches) {
            if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
                $('.titleImg').addClass('invisible')
                $('.navbar').css("height", "3em")
                $('.menuBtnList').css("top", "3em")
            }
            else {
                $('.titleImg').removeClass('invisible')
                $('.navbar').css("height", "4em")
                $('.menuBtnList').css("top", "4em")
            }
        }
        else {
            if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
                $('.titleImg').addClass('invisible')
                $('.navbar').css("height", "3em")
                $('.menuBtnList').css("top", "3em")
            }
            else {
                $('.titleImg').removeClass('invisible')
                $('.navbar').css("height", "6em")
                $('.menuBtnList').css("top", "6em")
            }
        }
    }

        
    function hideNavMenu(gridToShow) {
        if ($('.menuBtnList').hasClass('d-none')) {
            $('.menuBtnList').removeClass('d-none')
        animateCSS('.menuBtnList', 'slideInRight', function() {
            })
            
        }

        else {
            animateCSS('.menuBtnList', 'slideOutRight', function() {
                $('.menuBtnList').addClass('d-none')
            })
        }
}

    function initalizeApi() {

            if (counter === 1) {
                type = 'classes/'

                loadAppData(type)
            }
            if (counter === 2) {
                type = 'monsters/'

                loadAppData(type)
            }
            if (counter === 3) {
                type = 'spells/'
                
                loadAppData(type)
            }
            if (counter === 4) {
                type = 'magicitems/'
                
                loadAppData(type)
            }
    }

    function loadAppData(type) {
        $.ajax(apiUrl + type, { dataType: 'json'
        }).then(function (responseJSON) {
            var tempstorage= []
    
            var counter = responseJSON.count

            condenseData(type, tempstorage, counter)

        })
    }

    function condenseData(type, tempstorage, counter) {
            $.ajax((apiUrl + type + '?limit=' + counter), { dataType: 'json'
            }).then(function (responseJSON) {
                tempstorage.push(responseJSON.results)
            condenseList(tempstorage, type)
            })
        
    }

    function condenseList(tempstorage, type) {
        var detailsList = []
        
        $.each(tempstorage, function(key, value) {
            addToList(tempstorage, key, detailsList, type)
        })

    }

    function addToList(array, index, list, type) {
        $.each(array[index], function(key, value) {
            list.push(value)

            if (list.length === array.length) {
                array = []
                $('.progress-bar').width(loading)
                allData.push(list)
                setTimeout(function(){
                    createItemList(type)
                }, 1000);
                

            }
        })
    }
    
    function createItemList(type) {
        if (type === "monsters/") {
            $.each(allData[1], function(key, value) {
                key = {
                    name: value.name,
                    img: value.img_main,
                    size: value.size,
                    languages: value.languages,
                    type: value.type,
                    reaction: value.reactions,
                    challenge: value.challenge_rating,
                    speed: value.speed,
                    armor: value.armor_class,
                    actions: value.actions,
                    specabil: value.special_abilities,
                    alignment: value.alignment,
                    hitpoints: value.hit_points + ' ' + value.hit_dice,
                    strength: value.strength,
                    dexterity: value.dexterity,
                    constitution: value.constitution,
                    intelligence: value.intelligence,
                    legend: value.legendary_actions,
                    wisdom: value.wisdom,
                    charisma: value.charisma,
                    strsave: value.strength_save,
                    dexsave: value.dexterity_save,
                    constsave: value.constitution_save,
                    intellsave: value.intelligence_save,
                    wissave: value.wisdom_save,
                    charsave: value.charisma_save,
                    senses: value.senses,
                    dmgresist: value.damage_resistances,
                    dmgimmunit: value.damage_immunities,
                    dmgvulner: value.damage_vulnerabilities,
                    conimmunit: value.condition_immunities,
                }
                var $newElement = $('<button class="btn btn-dark col m-1 p-1 monsters" data-toggle="modal" data-target="#modalDisplay"></button>').text(value.name);

                $('.monsterGrid').append($newElement);
                $newElement.on('click', function (event) {

                createModalEvent(event.target.innerText, key, type) 
                })
            })
            counter++
            dataCounter = 0
            loadingProgress(40)
            initalizeApi()
        }
        if (type === "classes/") {
            $.each(allData[0], function(keys, value) {
                keys = {
                    name: value.name,
                    desc: value.desc
                }
                var $newElement = $('<button class="btn btn-dark col m-1 p-1 classes" data-toggle="modal" data-target="#modalDisplay"></button>').text(value.name);

                $('.classGrid').append($newElement);
                $newElement.on('click', function (event) {

                createModalEvent(event.target.innerText, keys, type) 
                })
            })
            counter++
            dataCounter = 0
            loadingProgress(10)
            initalizeApi()
        }
        if (type === "spells/") {
            $.each(allData[2], function(keyb, value) {
                keyb = {
                    name: value.name,
                    desc: value.desc
                }
                var $newElement = $('<button class="btn btn-dark col m-1 p-1 spells" data-toggle="modal" data-target="#modalDisplay"></button>').text(value.name);

                $('.spellGrid').append($newElement);
                $newElement.on('click', function (event) {

                createModalEvent(event.target.innerText, keyb, type) 
                })
            })
            counter++
            dataCounter = 0
            loadingProgress(20)
            initalizeApi()
        }

        if (type === "magicitems/") {
            $('.monsterGrid').removeClass('invisible')
            $.each(allData[3], function(key1, value) {

                key1 = {
                    name: value.name,
                    desc: value.desc
                }
                var $newElement = $('<button class="btn btn-dark col m-1 p-1 mgcitem" data-toggle="modal" data-target="#modalDisplay"></button>').text(value.name);

                $('.magicItemGrid').append($newElement);
                $newElement.on('click', function (event) {

                createModalEvent(event.target.innerText, key1, type) 
                })
            })
            loadingProgress(20)
        }
    }

    function createModalEvent(button, item, listType) {
        $('.modalimg').empty()
        $('.modal-basestats').addClass('d-none')
        $('.modal-monstmain').addClass('d-none')
        $('.monstertype').addClass('d-none')
        $('.modal-abilities').addClass('d-none')
        $('.modal-stats').html('')

        if (listType === "spells/") {
            var create = $('<p class="text-center mx-3"></p>').text(item.desc)
            $('.modal-title').text(item.name)
            $('.modal-stats').append(create)
            $('.modal-stats').css("text-transform:", "none;")
        }
    
        if (listType === "monsters/") {
            $('.modal-basestats').removeClass('d-none')
            $('.modal-monstmain').removeClass('d-none')
            $('.monstertype').removeClass('d-none')
            $('.modal-abilities').removeClass('d-none')

            var body = document.querySelector('.modal-stats')
            var typetitle = document.querySelector('.monstertype')
            var stats = document.querySelector('.statdata')
            var info = document.querySelector('.modal-monsterinfo')


            $('.modal-title').text(item.name)
            typetitle.innerHTML = '<i>' + item.size + ' ' + item.type + ', ' + item.alignment + '</i>'
            if (item.img != null) {
                var img = $('<img class="monstimg">');
                img.attr('src', item.img);
                img.appendTo('.modalimg');
            }
            body.innerHTML = '<strong>  Armor: </strong>' + item.armor + '\n<strong>  Speed: </strong>' + speedcalc(item.speed)  + '\n<strong>  Hitpoints: </strong>' + item.hitpoints

            stats.innerHTML = '<td>' + item.strength + abilityModifier(item.strength) + '</td>' + '<td>' + item.dexterity + 
                                abilityModifier(item.dexterity)  + '</td>' + '<td>' + item.constitution + abilityModifier(item.constitution)  + '</td>' + '<td>' + item.intelligence + abilityModifier(item.intelligence)  + '</td>' + '<td>' + item.wisdom + abilityModifier(item.wisdom)  + 
                                '</td>' + '<td>' + item.charisma + abilityModifier(item.charisma)  + '</td>'

            info.innerHTML = savingThrowCalc(item) + damageCalc(item) + '<u>Senses:</u> ' + item.senses + '<br>' + languages(item.languages) + '<br>' + '<u>Challenge:</u> ' + item.challenge + challengeRatingCalc(item.challenge)
            specAbilities(item.specabil)
            actions(item.actions)
            //legendactions(item.legend)
        }
    
        if (listType === "classes/") {
            $('.modal-title').text(item.name)
            $('.modal-stats').text(item.desc)
        }
    
        if (listType === "magicitems/") {
            var create = $('<p class="text-center mx-3"></p>').text(item.desc)
            $('.modal-title').text(item.name)
            $('.modal-stats').append(create)
        }
    
    }

    function searchListener() {
        $('.searchbar').on('input', function(value) {

            if ($('.searchbar').hasClass('monst') ) {
                var index = 1
                var buttonList = document.querySelectorAll('.monsters')
                searchList(value.target.value, index, buttonList)
            }
            if ($('.searchbar').hasClass('spel') ) {
                var index = 2
                var buttonList = document.querySelectorAll('.spells')
                searchList(value.target.value, index, buttonList)
            }
            if ($('.searchbar').hasClass('clas') ) {
                var index = 0
                var buttonList = document.querySelectorAll('.classes')
                searchList(value.target.value, index, buttonList)
            }
            if ($('.searchbar').hasClass('mgcit') ) {
                var index = 3
                var buttonList = document.querySelectorAll('.mgcitem')
                searchList(value.target.value, index, buttonList)
            }
            

        })
    }

    function abilityModifier(ability) {
        var modifier = {
            '1':  '( −5)', '11':  '( +0)',  '21':  '( +5)',
            '2':  '( -4)', '12':  '( +1)',  '22':  '( +6)',
            '3':  '( −4)', '13':  '( +1)',  '23':  '( +6)',          
            '4':  '( -3)', '14':  '( +2)',  '24':  '( +7)',
            '5':  '( −3)', '15':  '( +2)',  '25':  '( +7)',       
            '6':  '( -2)', '16':  '( +3)',  '26':  '( +8)',
            '7':  '( −2)', '17':  '( +3)',  '27':  '( +8)',
            '8':  '( -1)', '18':  '(+4)',   '28':  '( +9)',
            '9':  '( −1)', '19':  '( +4)',  '29':  '( +9)',
            '10': '( +0)', '20':  '( +5)',  '30':  '( +10)',
        }

        return modifier[ability]
    }

    function challengeRatingCalc(challenge) {
        var challengeExp = {
            '0': ' (10 Exp)',      '1/8': ' (25 Exp)',
            '1/4': ' (50 Exp)',    '1/2': ' (100 Exp)',
            '1': ' (200 Exp)',     '2': ' (450 Exp)',
            '3': ' (700 Exp)',     '4': ' (1,100 Exp)',
            '5': ' (1,800 Exp)',   '6': ' (2,300 Exp)',
            '7': ' (2,900 Exp)',   '8': ' (3,900 Exp)',
            '9': ' (5,000 Exp)',   '10': ' (5,900 Exp)',
            '11': ' (7,200 Exp)',  '12': ' (8,400 Exp)',
            '13': ' (10,000 Exp)', '14': ' (11,500 Exp)',
            '15': ' (13,000 Exp)', '16': ' (15,000 Exp)',
            '17': ' (18,000 Exp)', '18': ' (20,000 Exp)',
            '19': ' (22,000 Exp)', '20': ' (25,000 Exp)',
            '21': ' (33,000 Exp)', '22': ' (41,000 Exp)',
            '23': ' (50,000 Exp)', '24': ' (62,000 Exp)',
            '25': ' (75,000 Exp)', '26': ' (90,000 Exp)',
            '27': ' (105,000 Exp)','28': ' (120,000 Exp)',
            '29': ' (135,000 Exp)','30': ' (155,000 Exp)',
        }

        return challengeExp[challenge]
    }

    function actions(actions) {
        var string = []
        if (actions.length >= 1) {
            $('.modal-actions').html('<h2 class="my-3">Actions </h2>')
            
            actions.forEach(function(e, index) {
                string[index] ='<strong>' + '<u>' + e.name + ':</u></strong> ' + e.desc + '<br>'
                create = $('<p></p>').html(string[index])
                $('.modal-actions').append(create)
            })
        }
        else {
            $('.modal-actions').addClass('d-none')
        }
    }

    function specAbilities(abilities) {
        var string = []
        
        $('.modal-abilities').html('<h2 class="my-3">Abilities</h2>')

        if (abilities.length >= 1) {
            abilities.forEach(function(e, index) {
                string[index] ='<strong>' + '<u>' + e.name + ':</u></strong> ' + e.desc + '<br>'
                create = $('<p></p>').html(string[index])
                $('.modal-abilities').append(create)
            })
        }
        else {
            $('.modal-abilities').addClass('d-none')
        }
    }

    function damageCalc(item) {
        var damageStats = {
            'Resistance': item.dmgresist,
            'Damage Immuninity': item.dmgimmunit,
            'Vulnerabilities': item.dmgvulner,
            'Condition Immuninity': item.conimmunit
            
        }
        string = []
        Object.keys(damageStats).forEach(function(e, index) {
            if (damageStats[Object.keys(damageStats)[index]]  != '') {
                string[index] = ' <u>' + Object.keys(damageStats)[index] + '</u>: ' + damageStats[Object.keys(damageStats)[index]] + '<br>'
            }
            else {
                string[index] = ''
            }
        });

        dmgStr = string[0] + string[1] + string[2] + string[3]

        return dmgStr

    }

    function languages(item) {
        var returnitem

        if (item === '' || item === '-') {
            returnitem = 'none'
        }

        else {
            returnitem = item
        }

        return '<u>Languages:</u> ' + returnitem
    }

    function savingThrowCalc(item) {
        var savingThrows = {
            Str: item.strsave,
            Dex: item.dexsave,
            Con: item.constsave,
            Int: item.intellsave,
            Wis: item.wissave,
            Cha: item.charsave,

        }
        var string = []
        var name = ''
        Object.keys(savingThrows).forEach(function(e, index) {
            if (savingThrows[Object.keys(savingThrows)[index]] != null) {
                string[index] = ' ' + Object.keys(savingThrows)[index] + ': ' + savingThrows[Object.keys(savingThrows)[index]]
            }
            //This is to remove empty elements
            arr = string.filter(item => item);
            if (arr[0] === undefined) {
                arr[0] = ''
            }
            else {
                name = ' <u>Saving Throws:</u> ' + arr + '<br>'
            }
        })
        
        return name
    }

    function speedcalc(list) {
        var string = []
        Object.keys(list).forEach(function(e, index) {
            if (Object.keys(list)[index] === 'hover') {

                if (list[Object.keys(list)[index]]) {
            string[index] = ' ' + 'hovers '
                }
            }

            else {
            string[index] = ' ' + Object.keys(list)[index] + ' ' + list[Object.keys(list)[index]]
            }
        })

        
        return string
    }

    function searchList(value, index, buttonList) {
        
        var v = value.length 
        var lowerCaseValue = value.toLowerCase();

        buttonList.forEach(function(e){
            $(e).hide()
        })
        
        allData[index].filter(function(e, index) {
            var eLowerCase = e.name.toLowerCase();
            if (eLowerCase.slice(0, v) === lowerCaseValue) {
                var search = buttonList[index]

                $(search).show()
                    //search.classList.add('is-visible')
                
            }
        })
    }

    function showAll() {
        var monsterList = document.querySelectorAll('.monsters')
        var spellList = document.querySelectorAll('.spells')
        var classList = document.querySelectorAll('.classes')
        var mgcItemList = document.querySelectorAll('.mgcitem')

        monsterList.forEach(function(e){
            $(e).show()
        })
        spellList.forEach(function(e){
            $(e).show()
        })
        classList.forEach(function(e){
            $(e).show()
        })
        mgcItemList.forEach(function(e){
            $(e).show()
        })
    }
    
    return {
        start: eventListener,
    }

})()

master.start()
