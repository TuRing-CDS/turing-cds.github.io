---
layout: post
title:  "[S]trategy"
permalink: /strategy
date:   2016-11-26 11:49:45 +0200
---

<script>
    fetch('https://v3.api.cavacn.com/tuling-rsos/c2/strategy/list').then(function(res){
        return res.json();
    }).then(function(json){
        console.log(json);
    })
</script>