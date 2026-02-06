https://youtu.be/bA-WmidVSGo?si=xYqZq-OpgNxz0iwp

Search in video
Introduction
0:00
Welcome to the most comprehensive course on agentic workflows ever created absolutely free. Up until recently, the
0:05
term agent was associated primarily with a ton of hype and very little in the way of actual business value. But today, the
0:10
tech is now good enough that Agentic workflows are definitively here and they are without a doubt the future of
0:15
workflow building. Now, I'm not exaggerating when I say these will quickly run the entire economy. So, if you've been looking for a way to start
0:21
learning about agentic workflows to automate business processes and potentially generate a lot of revenue either for yourself or maybe the
0:27
companies that you work with, you guys are in the right place. My name is Nick. I've scaled two agencies to over $160,000 in combined revenue. I also
0:33
lead the most profitable AI automation community out there. It's called Maker School and it generates nearly $300,000 a month in profit. I say this to make it
0:39
clear. I'm no stranger to revenue or profit. And this course has been created with all that in mind. My goal here was not just to teach you guys technology
0:45
for techny's sake, but to show you how to use these things in an actionable way that helps you make real money. So, it's
0:52
a lot less on the hypothetical and a lot more on the immediately applicable. This course will guide you through three things. First, I'm going to show you
0:58
guys some practical examples of agentic workflows so you can see what's possible like right now. I'm going to frontload this because I think a lot of people
1:03
have no idea how powerful these things are yet and I want you to see them for yourself. Second, I will show you how to build an agent environment that does
1:09
something called separation of concerns using a simple framework called DOE or DO for short. That stands for directive
1:15
orchestration and execution. Third, I'm going to show you guys how to create what are called self-anneeing agentic workflows which are workflows that
1:21
maintain and improve themselves over time. We will set up an agentic workflow environment in a popular IDE called
1:26
anti-gravity. You don't need to know any programming or have really any workflow building background. Uh I'm going to
1:31
guide you guys through everything from start to finish. And by the end, you will have an agentic business operating system that lets you do most of your
1:36
economically valuable work, probably dozens of times faster than usual through a simple text box. I've also added timestamps for everything in the
1:42
description. So feel free to watch this over multiple sessions if you want. That's how I designed it. And if you'd like, please consider bookmarking this
1:48
video right now so you guys can easily come back to it later. Ready? Let's get started. Okay, so next I'm going to show you a few live production grade examples
1:54
of real agentic workflows that are running in my business right now. These are not hello world, you know, beginner
2:00
examples. These are flows that are actually generating me revenue and saving quite frankly dozens of hours of manual labor every week. They also
2:05
operate with a level of reliability that most people think is impossible with current AI. So, first some background into my businesses so we're all on the
2:12
same page. Uh my main company is called Leftclick. It is basically a souped-up sales and marketing agency. We use AI to
2:17
generate leads for a variety of businesses, primarily through outbound marketing, which means cold email. I also run a dental marketing business
2:23
that does around $2 million a year. And this is similar, although they generate opportunities the other way via inbound marketing, which is mostly ads and PPC.
Practical example 1: lead generation, enrichment & personalization
2:28
So, first I'm going to show you a simple system that I put together in less than 15 minutes start to finish that automates a very common task that we
2:34
used to do pretty much every day. Uh, to make a long story short, we are going to start by scraping a bunch of leads and then getting a bunch of email addresses
2:40
and then doing some enrichment and then some AI personalization on top. And I'm going to start all of this with literally just a single message. It's
2:46
going to take me a few seconds. The ID we're going to be using here, as mentioned, is anti-gravity, which is Google's recent agentic platform. And I
2:52
don't want you guys to focus as much on the code or the way the workspace is set up. Just the example cuz you guys will be able to build something like this at
2:57
the end of the course. Out here in my garage, I'm just kidding. Out here in my anti-gravity IDE, I have three panels.
3:02
On the lefth hand side here, I have an explorer. This is just a file explorer similar to any that you guys have probably used on a Mac or a PC. I just
3:09
want you guys to ignore literally everything here except for the directives and the execution folders.
3:15
Directives are where we store highle instructions surrounding how to do a task. Execution is where we have the
3:20
tool layer where it'll actually go and call specific scripts that it itself has generated in order to do a task. Now,
3:26
it's not very important that you know exactly how all this stuff works right now. I'm just doing a demonstration, but
3:31
essentially inside of scrape leads, we just have highle instructions that guide it through a process. Then inside of scrape leads. we have a script that
3:39
actually does the scraping. Um, obviously the model could try and do all of this stuff itself with the base tools that it has access to, but that's where
3:45
you run into issues where the model is so flexible that it doesn't actually accomplish the stated business need reliably enough. What we do instead is
3:51
we create temporary scripts. If those scripts are good, then the model keeps them and then it adds complexity over time. Okay, cool. Next up, we have uh
3:58
this middle panel here which just stores some highle access to various things. Agent manager, edit coding, line code
4:04
with agent, etc. In the right hand side, we actually communicate with the agent. So, said I wanted to scrape some leads. I'm just going to scrape um 200 realtors
4:12
in the United States. And look at that. I even didn't spell United States correctly, but that's okay. I trust that
4:17
the model with this framework will be able to do what I asked it to do. So, it looks like the very first thing it's
4:23
doing is analyzing directives and execution. It's then going through scraping all the information. Now, it's
4:28
going to open up these thought processes, and you don't necessarily need to look at them. That's not necessarily relevant. Um this thought
4:34
process here is just what the what the agent is going through. Uh and it's feeding its outputs back to its inputs over and over and over. This is the task
4:41
um implementation plan that is generated. It's basically going to start by reading this stuff, then create a plan. There we go. Then it's going to um
4:48
do some execution steps and then give some verification. Then at the end, we're going to have a Google sheet with
4:54
a bunch of leads, which is pretty great. Now, at this point, you can do a couple of things. I mean, what I do is I just
4:59
open this in the right hand side of my Mac and then I'll just like have something on the left hand side of my Mac and it'll just do that work and then
5:04
when the agent is done doing the task, which may take 5 or 10 minutes. I mean, we're getting to really long time scales
5:09
here, it will present me the results and then I can do whatever the heck I want with it. Alternatively, we can look at
5:14
what the agent is doing a little bit more under the hood. So very first thing that it's going to be doing is if I go
5:20
to a scraping platform here. Now I know for a fact it's running this on a service called ampify because that was
5:25
some of the logic that I built into the highle directive. And so I can actually go and I can verify that we have indeed
5:31
scraped what looks like 25 initial prospects. We scrape 25 initial prospects cuz that's part of the
5:36
directive. The directive says hey I want you to assemble a big list of what you think are realtors using a bunch of
5:41
filters. If you find uh that more than 85% of these are in our target market,
5:47
then I want you to uh keep them and then run a full scrape. If they're not uh 85% or more within our target market, then I
5:54
want you to redo your filters, sort of self anneal until you find the right set of filters that actually accomplishes
5:59
that stated task. And so that's what we did over here. We ran a test scrape, found 25 leads. It then went through and
6:06
verified how many of those leads were actually in our target market. It accomplished this and realized more than, you know, 85% were. And now it's
6:13
gone through and it's actually found those 200 leads. So, as you see, we received a console notification saying the leads are now ready in the data set.
6:19
Now, what it's doing is it's going to present them to me. Okay, it's now delivering me that information. You can
6:25
see it right over here. So, we actually have the Google sheet that contains all of those leads. And as part of my
6:30
request, it's even going through and enriching lead email addresses using another service. Now, this may seem
6:35
pretty complex, but I want you guys to know all that I needed to do in order to get a workflow that did all of this
6:41
totally autonomously was I gave it a brief bulletoint description, and then I
6:47
spent maybe 5 or 10 minutes going back and forth with it, having it construct a script that does this. Now, as a result,
6:52
we ended up getting 178 out of the 200 emails. And I'm just rechecking this. We've taken those 178 now to 193 because
6:59
we've done, as I mentioned, some enrichment using another platform. On the right hand side here, it just crafted a new column called casual
7:05
company name. This is just part of my cold email copyrightiting SOP within the company. When we send an email out to people, we don't use their company name
7:11
because that would be kind of silly. You know, the Bal Serac group of AB and co-realtors, for instance, is very long.
7:17
Could you imagine saying, "Hey, Pete, love the Berzac group of AB and co-realtors." No. Realistically, if
7:23
we're sending a cold email, we wanted to say something like Baliserac group. And as you guys could see over here, we've
7:29
actually done that. It's gone through and it's crafted a casual version of that company name Berzac just using
7:34
logic that I had previously baked in. Now coming back to it, we can see that we now have the results and it's
7:39
actually formatted it in a very brief overview message that I've asked it to do. It said it scraped 200 realtors for
7:44
the United States, enriched 15 additional email addresses. We casualize 191 company names. Then we even have
7:50
access to the Google sheet. So I'm opening up that Google sheet again. It's the same thing that we had earlier, but just for posterity sake. And uh all of
7:56
our information is right here. How long did that whole process take me? Very, very little time. I now have the data in a format that I can do basically
8:02
whatever the heck I want with. Okay, let's take a look at another example. This time we're going to be automating the process of a post sales call proposal and email. You can absolutely
Practical example 2: post-sales call proposal generator
8:08
build this stuff procedurally like through old school drag and drop, make.com, nan, etc. But it's a lot less flexible and the system typically needs
8:15
to be maintained and updated pretty regularly with agentic workflows. Instead, you just build it once and it will continue to improve itself reliably
8:21
over time, which is wild. Okay, so let me show you guys a second example. Now, hypothetically, let's say I wanted it to generate a proposal for me. This should
8:28
illustrate just to what degree you can use these sorts of things as basically assistance in your business. But basically, I have a directive store
8:34
that's pretty high level that's just called create proposal. It then guides you through a bunch of lower level scripts like create proposal, create
8:40
content calendar, and stuff like that. So, I'm just going to say create a proposal. I'm not even going to give it any context. I've stored all of this
8:46
stuff inside of the directives. In this way, we realistically are building like a co-orker, like an AI employee in our
8:54
business. Imagine if you just sent somebody a Slack message like, "Hey, create a proposal." Well, now we're going to get the results. I'm using a
9:00
different model here just to demonstrate that you can use whatever models you guys want. In this case, it's now Claude Sonnet 4.5. Although Gemini 3, as of the
9:07
time of this uh video, is a really good model. You don't necessarily need to use like the best most cutting edge models for this information. And you can see
9:13
it's still interpreted and understood all of my requests. It's even going as far as ask me a bunch of information. So, as you see, we have structured info,
9:20
call transcript, or quick details. So, I could actually provide like a call transcript, or I could have it check my Fireflies or whatever the heck. In this
9:26
case, I'm going to give you guys a very brief uh company profile. This is a real customer, but I'm going to be obscuring all their names and stuff like that, so
9:32
we can generate a proposal that actually makes sense. All right. And I've just copied and pasted over a bunch of highle
9:37
information here. I'm just going to put it in and press enter. Although, you know, hopefully you guys see there
9:42
variety of different ways you could input this info. You could just do it through a call. You could just do some highle basic details, whatever. It's now
9:49
um taking all that information and it's actually going through and it's generating a proposal based off of my uh instructions. As you see here, we have a
9:55
pandock proposal task list now. So, it's going to start by expanding the problems and benefits. The reason why I built
10:00
this out is because I often just store very high level understanding what the client wants in my head. So, I will literally just be on sales call and I'll
10:06
just say, oh, you know, person wants uh 45,000 in cost savings for whatever platform. So, what it does is it takes
10:12
that information and it expands it based off the context of the company. It'll do a little bit of research into the business and understand what it needs in
10:17
order to put something together that actually looks nice. It'll do so according to my tone of voice and and everything like that. Okay, it's now
10:23
creating that panadoc proposal. Pumped together just a giant API request for me and it did so completely autonomously. I
10:29
should note like I didn't have to actually do any of that information in the highle instructions. I actually just gave it some very brief instructions
10:35
like hey I want you to create proposals in pandock for me and send follow-up emails. Um could you create me a directive for it? It's now sending a
10:41
follow-up email. It's doing this using an MCP or model context protocol tool that I've installed. And now it's sending me a message saying, "Hey, we
10:48
created a proposal successfully." We've also sent a follow-up email with a four-part implementation breakdown. So, I'm just going to commandclick this,
10:54
open up this puppy, and as you guys can see, we have the proposal. Now, um I should note that it didn't produce
10:59
everything in this proposal. I had a template set up here. So, it filled in all of the things in yellow. And this is just a proposal template that I've been
11:06
using for a variety of purposes. And as you can see, it's gone through and taken my very high level details and then gone
11:11
through and wrote a cool proposal. So systems are innately high leverage, but this leverage can either work for you or against you in your case. And there are
11:17
a few small persistent problems that are currently impacting growth. Right now, you're burning roughly 50k per year on outreach in Apollo. Legacy tools are
11:22
built for a different era of sales. The platforms are expensive, clunky, don't talk to each other. And every dollar you spend here is a dollar that could be reinvested in growth. But instead, it's
11:29
locked up in bloated enterprise contracts that don't deliver proportional value, right? I mean, obviously the prompt is, hey, write this
11:35
value base. talk about savings and so on and so forth. We do the same thing for solutions. Um we obviously have, you
11:41
know, a bunch of templated information over here. We scroll all the way down to the bottom. You can see we also have the little investment section here that
11:46
includes a bunch of information around um how much money they're paying in month one, month two, month three and beyond. So I mean I used a hypothetical
11:52
company name here and then an email address. But yeah, this stuff works in real production context. I use this all the time. This was another system that I
11:59
developed in something like 15 minutes or so. Very high level instructions. You just give it a brief. You let it know
12:04
about the self annealing concept which I'll cover later on in this course and then voila, it goes and it does things that are actually pretty economically
12:10
valuable for you. We're going to cover how to make stuff like this throughout the rest of the course. You guys are going to know how to build simple workflows like this in 15 minutes and
12:17
essentially just have an AI companion/ AI employee that goes out, does things for you, and then returns carrying the
12:23
deliverable uh hoisting it above their head and presenting it to you like a king. It's pretty sick. Okay, so
Stochasticity & DOE framework
12:28
hopefully it's clear. These agents are not just chat bots. They are basically universal interfaces let you control software. Now the catch is there's
12:34
actually a fair bit going on behind the scenes that you didn't see. If you were to just open up chatbt or cloud code and paste in a prompt asking it to do what I
12:40
showed you, it will almost certainly fail. Maybe not the first time, but it'll eventually hallucinate. It'll get stuck in a loop. Uh might work once at
12:47
the beginning and then fail the second or third times. Or maybe it'll tell you that, you know, can't access a file or whatever other edge failure case that
12:52
comes up. So if you're a hobbyist, that's usually fine. And you know, a 50% success rate is probably acceptable to you. But if you're a business and you
12:59
make, I don't know, a million dollars a month, that is unacceptable. You cannot run a million dollar a month operation
13:04
on a system that only works most of the time. If it even screws up literally 2%, that is not just 2% of your revenue.
13:10
That problem could cost you a 100% of your revenue. Consider what happens if you try automating a workflow using agents like this, but it's like to send
13:16
an invoice or something and you send the wrong invoice to the wrong person. You could literally lose a giant client contract. So, we don't need just the
13:23
ability to do things. We need reliability and consistency. Basically, in businesses, we need a system that
13:28
works every time exactly how we expect them to. So, to make this work, we need to build a structure around the model that forces it to be reliable, which is
13:35
what I'm going to talk about with you next. So, the problem is really called stochasticity, which is like non-deterministic outputs. If you guys
13:40
were to ask an LLM to scrape leads from LinkedIn, you know, it might work the first time, but on the second or the third time, it may also fail. On the
13:47
fourth, it may hallucinate a completely different task. And on the fifth, it may say, "Sorry, this is against regulations," or something like that. To
13:52
make a long story short, this is not something that is reliable enough for that predefined business pipeline that I just showed you. The reason why is
13:59
because in business, even a 1% rate of inaccuracy can lead to a revenue reduction of 50% or more. You know, this
14:04
is not academic theory here. It's not just a business textbook. This is real life. If you guys send the wrong invoice, even 1% of the time, you don't
14:11
hurt your business by 1%. You could completely destroy your whole client base. And because LLMs are probabilistic, aka they guess the next
14:18
token, and business logic is deterministic, which means you need the exact same output format basically every
14:23
time, the two are at odds. When you try and make an LLM do everything, which is planning, tool use, execution, formatting, whatever, um the error rate
14:30
compounds. A good way to think about this is if each step has a 90% success rate, a five-step task mathematically is
14:38
0.9 raised to the 5 equals 0.59. to deconstruct all that for you. That
14:44
just means that this task where each individual step may be quite likely to succeed on net only has a 59% success
14:51
rate, which is completely unacceptable for any real business operation. Okay, so to fix this, we don't just try and make the LLM smarter. What we do is we
14:58
actually fundamentally change the architecture around the LLM and we take advantage of the LLM's built-in coding tools to do a bunch of the heavy lifting
15:04
for us. So instead of asking an LLM to do something directly, we're just going to ask it to create a standardized piece
15:10
of code to do that thing, which is, you know, philosophically the same thing that people were doing 30 to 40 years
15:15
ago. There's no difference. Then it just uses the code that it wrote to do the task itself. This significantly
15:21
mitigates the flexibility of the outputs and it also allows you to leverage what AI is fantastic at, which is code,
15:26
because that's what everybody's making AI to do, while minimizing what it is bad at, which is reliable, predictable
15:32
flows. Okay, so how do we do this? Well, in order to make this happen, we need to split the work of the LLM into three distinct layers. The first is the
15:39
directive layer. The second is the orchestration layer and the third is the execution layer. What's great about this
15:44
is this is the exact same structure used by a lot of very successful human organizations. You will have a manager
15:50
which is equivalent to the directive, the employee which is equivalent to the orchestrator and then the tools which
15:55
are equivalent to the execution. So, let me explain the structure in real context and then why the specific one is the key
16:00
to in my opinion unlocking reliable agents. So, what do these three layers actually look like? Well, here's how I
16:06
typically visualize them. We start with the top, which is your directive layer. Now, these include workflows, SOPs. For
16:15
people that don't know what an SOP is, that just stands for standard operating procedure,
16:21
and essentially what we do is we write all these out in some form of easily
16:27
formattable text, which in our case is going to be markdown. And the specifics of markdown aren't
16:33
super important if you're not really sure what that means. Essentially, it's just a way that you can like format and and add some form of structure to tax
16:40
without having to consume a ton of tokens. And what these are, these are highle instructions that just guide an
16:46
eventual orchestrator through what a process looks like. So, I mean, an
16:51
example might be a recipe, right? You are looking up a recipe on how to make,
16:57
I don't know, some tofu or something like that. And step one says add soy sauce, vinegar, and whatever to a
17:03
container. These are high-level instructions, but all they do is they describe what the agent is going to do
17:10
and define guard rails that an agent eventually goes down and chooses of its own accord. Okay, so highle instructions
17:18
are where directives come into play. Now, from there, we obviously need something to actually go and take those
17:24
highle instructions and then reason over them. And that's where your AI agent comes into play. Now, you notice that I
17:31
also wrote slash employee over here. Why? The reason why is because this is
17:36
actually a very similar structure to the way that most large organizations work. Most large organizations will have
17:42
highle directives written as workflows or SOPs in natural language. And then an
17:47
employee will be responsible for digesting them, then converting them into more actionable tasks. But anyway,
17:54
um, in our case, you know, for our purposes, that's where our little AI agent comes into play. So, our AI agent
18:00
essentially gets to do a reasoning loop. And so, it is going to
18:06
read, if we just go here to the right, it's going to read through our directive. It's then going to choose an
18:14
action. It's then going to execute said action, and then it's going to evaluate the
18:21
results. This same loop here has been called a million different things. I'm
18:26
going to leave it at read through, choose, execute, and evaluate. But as long as you understand that there is a
18:32
sequential series of steps that any sort of software agent is going to follow, you guys know more than enough. Don't
18:38
worry too much about various conventions or acronyms or whatever. Those aren't things that actually help you understand
18:44
and make money. Okay. So, these AI agents go through these reasoning loops. They coordinate and they're responsible
18:50
for the ultimate task management. They function very similarly to maybe like a mid-level manager or something like
18:55
that. Once you have chosen sort of what to do next, you need to execute and
19:02
that's where the execution layer comes in. And so essentially the AI agents/ employees in your business will then go
19:08
out and pick particular tools, usually tools that it's already developed or it'll go and it'll write tools in the
19:16
form of Python scripts. At least that's my recommendation. a variety of different languages you can use for this, but Python scripts tend to be the
19:21
best just because Python are is the language that most of these large language models um were trained on
19:27
initially. There's an overabundance of Python um you know code out there and Python's used as like artificial and
19:33
synthetic data for a lot of these as well. So they just tend to work really well with Python. And then you know these produce some sort of output. Okay,
19:42
this is the output. I don't know, could be maybe some numbers, could be, I don't know, some strings, whatever the heck
19:48
that the purpose of this Python script is. In the example that I showed you guys, could be a lead, could be a PDF.
19:54
And then that information actually loops back here to the orchestrator, the Agent, which then reads the results and
20:01
then can actually choose if it wants to to go upstream and manipulate the very directive as well. So this orchestrator,
20:07
you can kind of think of this as a glue. Now, anybody here that's worked with traditional noode or low code platforms
20:14
before, this orchestrator works very similarly to make or nadn or zapier or any one of
20:25
these platforms. Okay. Um, all of these drag and drop platforms basically back
20:30
in the day and now are nothing more than glue which routes business logic through
20:38
nodes and then allows you to choose sort of what direction those things go based
20:44
off of some preset logic. And so the orchestrator in this case is the make n zapier lindy gum loop flow. It's just
20:51
now what we're doing is replacing that orchestration with AI agents. So, a agents are actually basically the
20:57
routers and they're responsible for choosing what to do and when to do it. What's really important here is there is
21:02
no code or any sort of executable written in the directive layer. The directive layer is literally just a
21:08
bunch of natural language prompts. When I say SOPs, I literally mean SOPs. They're the exact same type of standard
21:16
operating procedure that you would find in any company, which is why this is so valuable. If you take the DO approach,
21:21
you could literally take a pre-existing list of all of the standard operating procedures in a business and just drag
21:27
and drop them into your IDE and boom, you've already accomplished one of the
21:32
three main layers here. Literally just having a list of things to do. You can then feed that into an agent, have the
21:37
agent refine, and then convert that into lists of actionable tools so long as you provided things like API keys,
21:43
connectors, and so on and so forth, which is much easier than it sounds. So, I don't know if you guys have ever played a popular video game Minecraft
21:49
before, but if you haven't, essentially what happens is you're this character and then, you know, there's a bunch of
21:55
blocks around and you start off the game by just like beating a block and then, you know, the block outputs some some
22:01
wood or something like that. And as you progress in the game, you can add a bunch of wood to your inventory and
22:07
eventually put the wood together in specific forms and then, you know, instead of just having to to punch a block with your hand like a savage, you
22:13
know, you could kind of build yourself out some sort of hatchet. Okay. And it starts off as a wood hatchet, but then
22:19
you can continue pumping down more and more of these wood blocks and eventually, you know, reinforce the hatchet and start uh attacking some
22:26
stone or something. I'm obviously butchering this. Anybody here that's actually played this game to any degree should know. Um, man, it's been a while
22:33
since I've fighted the the the Ender Dragon or whatever the heck it's called. But, um, to make a long story short, I
22:39
want you to think about tools kind of like a character in Minecraft. You start off with absolutely nothing in your
22:46
execution folder. Okay? All you do is you give highle instructions and then
22:51
the agent will actually start making things like, you know, a pickaxe.
22:57
Then it'll start making things like, I don't know, like a hatchet. It will start making things like, I don't know,
23:03
some sort of sword or armor. And what's really cool, okay, is once it's made
23:08
these, it can then go back and reinforce these and then it can upgrade them. And eventually you can get to your little
23:14
diamond fortification or whatever um where your stuff is just really really good. It can, you know, replace one-off
23:20
endpoints with bulk endpoints or batch endpoints. It can economize the code so that it runs a million times faster than
23:26
it did initially. can go from like a big O of N squared all the way up to like a like an O of N or something like the
23:32
potential here is pretty unreal and once you build this environment or ecosystem just gets better and better and better.
23:38
Another way to think about this is I don't know some sort of caveman let's say in prehistoric times. This is Mr.
23:44
Sad Caveman because he doesn't have anything and there's some big saber-tooth tiger and I cannot for the
23:49
life of me draw a saber-tooth tiger. I don't even think I'm going to try. My god, that's about as bad as I thought.
23:56
It's looking more like Minecraft than anything else. Um, you know, saber-tooth tiger attacks him the first time. What's
24:01
he going to do? He's going to try punching him. He's going to find a rock on the floor. He's going to throw it. Not all of these things are going to be hyper effective, right? So, what he does
24:07
is, I don't know, go goes and makes a spear. Next time you see a saber-tooth tiger, what are you going to do? You're going to pick up the spear. You're going
24:13
to use that, right? As you eventually do this more and more and more, your spear is going to get better, more reinforced.
24:18
It's going to be more capable. So that in a nutshell is a good analogy for what is really going on here, especially in a
24:24
self-nealing sort of situation. Why do we do all of this? We do all of this to reel in the inherently probabilistic
24:31
nature of large language models. This is a diagram I just had a large language model come up with actually. And
24:37
essentially on the left hand side is the way that most people view these things. And it's the reason why agents up until
24:42
quite recently haven't really been able to be used in any sort of real business scenario. This delivers an uncertain
24:48
outcome. And while it's a lot more flexible, as you can see, these arrows are sort of going all over the place. Ultimately speaking, in a business, you
24:54
don't want flexibility. In a business, you want determinism. You want a very simple and easily interpretable list of
25:00
rules where if an input comes in here, we route it based off of some filter
25:05
that we have. And so what we do is we take the inherently flexible probabilistic nature of LLMs and use it
25:11
to create a bunch of deterministic pipelines and then it just calls the specific pipeline that it wants while
25:17
making it better and better and better over time. The last major point I'm going to make is speed. The historical
25:23
way that you get things done by calling LLMs with some sort of built-in tooling like HTTP requests or whatever is very
25:29
slow. Okay. But when you use tools you can go very fast. I mean, just as an
25:35
example, imagine if you fed a list of 10 items, okay, into some sort of LLM and
25:42
you said, "Hey, I want you to, I don't know, uh, reverse sort this or something
25:47
like that." So, I basically want you to take this list that's alphabetical and I want you to do this. I want you to take
25:53
all the letters and I want you to reverse them. If you did this within a large language model, it would actually have to calculate an enormously massive
26:00
matrix um you know series of arrays and matrices in order to do the simple task of just reversing or flipping this
26:07
array. Whereas if you created a specific tool like in Python to do this, you could do this virtually instantaneously.
26:13
The order of magnitude in the amount of time it would take to do the top thing, okay, using an LLM to bottom thing using
26:20
a tool is something like 10,000 times if not 100,000 times. Not to mention you
26:26
also have no token usage making this while not effective well not actually free because you are going to be using
26:32
your CPU and and maybe some sort of server if you want to host this elsewhere it will be effectively free
26:37
compared to just how much time energy and resources are being run in order to do silly requests like this using LLMs.
26:42
So now that you guys understand at a high level how the three layer software architecture works, let me just run you through what it'll look like exactly
26:49
within your integrated development environment. Remember how earlier when I were showing you guys the lead scraping example, I um hid a bunch of the
26:56
additional folder structure and stuff like that. The reason why is because these are things that are specific to
27:01
the development environment that you're using. But regardless of the development environment you're using, you will always have the following folders. Let's
27:08
just call this our workspace and just pretend that this is up at the very top. It's just like the big folder that contains all the other folders. Okay.
27:15
The folders that you will need in order to get this done in this way is you will need some sort of directives folder and
27:23
then you'll also need some sort of execution folder. Okay? And within
27:29
directives are going to live all of your SOPs. So I don't I'm just going to call this SOP1 MD. SOP2MD
27:38
over here within your execution folder is going to live all of your executables. So, I don't know. It'll be
27:43
like scrape_leads.py. Pi is just the ending of like a Python
27:49
script. Maybe it'll be, I don't know, enrich leads.py.
27:55
Now, we only have directives and execution here. Notice how we don't have the orchestrator. The reason why is
28:01
because the orchestrator is the LLM. And the LLM sort of the thing you know the big galaxy brain intelligence over here
28:06
that reads through the directives associates them with specific executables runs them okay so actually
28:13
executes these things in some sort of terminal prompt and then it just loops back and forth and back and forth over
28:18
and over and over again. If you can understand what I've just put in front of you here at least at a high level
28:23
without understanding any of the programming concepts or anything like that you can build a very good agentic
28:29
workflow. Okay, so that's the DOE or do framework. Now directives are your SOPs. These are the what that is the intent
28:35
the goal you know the rules of engagement. Orchestration is your agent which is the who. This is the decision
28:40
maker you know the router. And then execution is your code which is the how. And this is the reliable deterministic
28:45
machinery. It just runs the same every single time. Very valuable for businesses. By pushing the heavy lifting onto those deterministic Python scripts
28:52
which is the execution and then keeping the instructions really clear in markdown which are directives. We let the LLM do the one thing that it's
28:58
actually really good at which is being a very intelligent router. That solves a reliability problem, meaning your scripts will run the same way basically
29:04
every time because a Python script does not hallucinate. It either works or, you know, it errors out. And if it errors out, we can catch it. All your agent has
29:10
to do is decide when to run the thing. Right now, the vast majority of Agentic workflows are going to be built in what's called an integrated development
IDE: Integrated Development Environments
29:15
environment or IDE. I've talked a little bit about anti-gravity before and that is beyond the purpose of our course. But
29:20
I am sure that future agentic workflow builders will include dozens of different input methods and ways to build them that aren't in a terminal
29:26
style environment. But anti-gravity isn't the only IDE available and I want to run you guys through a brief little laundry list here. What I'm going to do
29:32
next is I'm going to break down how most IDs work just so you guys are familiar with it from uh you know a bird's eye perspective and then also a couple of
29:38
the tools we're going to be using and then after that we're going to learn self- annealing before we actually set it up all in a real environment. By the way, if you guys are already developers
29:43
or you understand how IDs work, you can skip through the section and then move on to the next one. And I should note, I'm not going to be giving you guys an
29:49
academic or textbook definition of how an ID works. We're just going to be working through it from a very practical perspective, aka what you actually need
29:55
to know in order to get out there and build workflows and make money with these things. If you guys want a much more in-depth review, there are variety of resources. Basically, every ID known
30:01
to man. Just search up the name of the IDE and then the word tutorial and the the service that built the system will provide one. Okay, next up, I got a
30:08
brief walkthrough for you of a typical integrated development environment. And I'm going to do this for two idees. The
30:14
first IDE is this one over here, which is anti-gravity. And the second IDE is this one over here, which is called
Antigravity: IDE walkthrough
30:20
Visual Studio Code. I wanted to show you both because Anti-gravity is certainly the newer hit on the block. Just
30:25
launched uh like within last week, I believe. But Visual Studio Code has a much bigger user base. A lot more people
30:31
are used to it. Regardless, you'll see that the concepts are very similar and they map basically one to one. Okay. So,
30:36
starting at the top left of anti-gravity, as you see here, we have that file explorer that I was referencing earlier. This file explorer
30:43
is very similar to just the base file explorer on your Mac or your PC. It's just a way that you can organize files.
30:49
Now, in order to get to these files, you do need to open a specific folder on your computer. And so, if you've just
30:54
launched some sort of anti-gravity IDE or maybe some sort of Visual Studio Code thing, you actually do need to create or
31:00
open a folder in order to access what we are seeing here. Okay. So in my case um you know I opened up this workspace
31:07
folder and that's why I see what I'm seeing on the lefth hand side. So within that I have this aagent.claude.ve
31:14
and then I have my directives execution tmp and this is just the course that I'm actually recording for you guys right
31:20
now as well as some additional files. The specifics of the files aren't very important again because I want this to
31:25
be programming agnostic. Depending on your background or whatever you will know what some of these mean and you won't. That's okay. I want you guys to
31:31
know that basically all of these were done completely automatically. I didn't actually like exert any control and choosing the structure. This is just
31:38
something that the agent came up with after reviewing you know effective software architectures and stuff like
31:43
that. So the things that are ultimately important for us are the directive folder here and then the execution
31:49
folder here. Okay. So now that you understand a highle overview just pay close attention to a few things.
31:56
Different file types typically have different sort of graphics and whatnot. They also have different file um
32:01
endings. And so a markdown file, for instance, if I click on my scrape leads here, it has that little M with a down
32:08
and then it's a MD, right? The Python script on the other hand,
32:13
you'll see changes a bunch of colors within and then it has this little this is supposed to be a Python with a pie at the end. And so superficial information
32:20
here, but um you're already starting to see there's significantly more structure in code. It's almost like looking at a
32:26
rainbow versus looking at, you know, the markdown uh directive. And that's just because in code there are a lot more I
32:33
want to say like data types that you need to keep track of. For instance, green here are comments. You know, blue might be variable definitions. Uh purple
32:40
might be some sort of logic and so on and so forth. So, you don't actually need to know any of this stuff, but when most people are new to IDs and
32:47
programming and they download one of these things and they start poking around, they get really overwhelmed because it just looks super complicated.
32:53
Okay, cool. So clearly what we do is we select files on the left hand side here. Then we open them in the middle. So
33:00
that's something that's worth taking a look at. You have one open picker at a time, but you could actually open as
33:05
many as you want. Just open to the side this one, open to the side this one, and so on and so forth, and it becomes pretty cramped. You could use the same
33:12
sorts of hotkeys that you normally use on, I don't know, like a Chrome instance or something. So in my case, I just hold command W, and then I can actually
33:18
delete open windows. That's pretty useful. On the right hand side here, moving over a bit, you see that there's
33:24
actually like a top level overview of your code. This is marginally useful. I believe this is like a VS code feature initially and now basically every
33:30
platform has used it just because sometimes you can go very very long with these big big code files. So this just
33:36
allows you to see the architecture at a glance and then I don't know quickly run through and then find um specific point in the code that you want. I don't
33:43
actually ever use this to be clear, but I just want to be able to explain what's going on under the hood so that if
33:48
anybody's super uh, you know, intimidated, at least now, you know, there's also up here a folder picker
33:54
which actually goes through and then shows you the specific folders and then more importantly the functions and the classes um that you're in. And so I'm
34:02
actually within this fetch campaign function here. If I go to get API key, you'll see this now changes to get API
34:07
key. Pretty wild. Um, but this is more or less what we're doing. We're creating a folder that contains a file and within
34:13
that file are a bunch of subfolders almost. It's just these are called functions. Okay. Now, the good thing
34:19
about Python is it is pretty readable. Not that you'll ever have to read it, but it is pretty readable if you ever did want to poke around. And when you um
34:26
add the right thing into your gemini.md, which I'll cover in a moment, um it actually comments the code reasonably
34:32
well. So, you can at least take a look at some of the code if necessary in order to get a high level understanding of what's going on. For people here that
34:37
are more used to let's say no code platforms like you know nad or make I just want you to look at all function
34:43
definitions. So define get API key and want you to just treat that like a single node on a graph. That's basically
34:49
what it is. So this is your get API key node and maybe this one here is your uh
34:54
fetch campaign node. You know this one here is your extract sequences node and so on and so forth. It's just instead of
35:00
it being nice and easy and visual left to right. Obviously, this is laid out sort of um top to bottom here in in
35:06
language that most people do not understand natively. So, that's the main drawback right now. But, as I mentioned, future gen decoding platforms are almost
35:13
certainly going to all be drag and drop. Now, in anti-gravity specifically, if we go to this middle panel here, you'll see
35:18
that there are a couple of options. If you hold command and E, you'll open your agent manager. Your agent manager is
35:24
basically just like a one-off chat box where you can talk to a model without actually having to look through um you
35:30
know, all of your code and whatnot. I mean, it'll still look through your code, but this just basically takes everything on the right hand side,
35:35
sticks it right in the middle. Then you can do Q&A. You can do whatever the heck you want with it, which is pretty nice. You can also construct specific agents
35:42
for different purposes, which is kind of neat. And you can even insert um knowledge items into your uh
35:49
anti-gravity instance. So that if there are things that you know you specifically uh request pretty often
35:55
that a model wouldn't really know you know eventually the model will actually add that to a knowledge base so that'll
36:00
constantly be able to consult this before answering your question. Up at the top you have an inbox. That inbox contains basically all of the
36:06
notifications that the agent has made for you. This is something that's anti-gravity specific and it's really
36:11
cool. I really like it. It's one of the cool parts about this that I think a lot of other IDs still have to catch up for.
36:16
And it's also a good example of these platforms moving more towards like agentic co-working than necessarily just
36:22
building in code. When you start a new conversation, by default, you start it in the playground. The playground is
36:28
just um a new conversation instance that is not tied to any particular workspace. But as you guys see here, you could also
36:34
open a specific workspace that you guys have um discussed with a model before if you want to. They also have the ability
36:40
to open new remote workspaces. So, this opens up the possibility to do things on other hardware later on, which is pretty
36:45
cool. There's also a browser use fate feature. So, as you can see here, if I click always allow, it'll actually go
36:51
and it'll request a specific um web page that I've given it access to, and even
36:56
pull in things like DOM elements, document object model for those you unaware, that allow you to do cool browser automations. This is my website
37:03
here, leftclick, and it's going through, scrolling a page, extracting elements, basically giving me a bunch of
37:08
information here. I just said, "Okay, go to leftclick, tell me what's on it." That's kind of neat. And if you're new to this feature, just head to the bottom
37:14
lefthand corner of the agent manager and you'll get everything that you need in order to do that. We're not going to be talking as much about that in this
37:20
course just because it is unfortunately still sort of shaky. Only works maybe 70 80% of the time. Certainly not good
37:26
enough for real enterprise business applications. But it is pretty cool and kind of an indication of how quickly we're soon going to be navigating um
37:33
most of the internet just using browsers. Okay. On the left hand side of the page, we also have a code search
37:39
feature. This is pretty neat because uh instead of searching code, you can actually just search in natural language. So for instance, if I type the
37:45
word orchestration, you could see that the top result is from a gemini.md file. And this is a file where I give the
37:52
agent highlevel tople instructions to basically guide it on what to do every time it's initialized. I'll get into
37:57
that later, but essentially I can find all instances of a specific word. So this is obviously pretty useful if
38:02
you're searching across a large agentic workflow base. This next feature here is called source control. Now, I don't talk
38:09
much about source control in this video or course because it's just not very relevant to most people here that don't have coding backgrounds, but essentially
38:15
there are ways that you can instantiate what's called a repository, which is just a way for you to store and then
38:21
control different updates of data. It's very popular if you're a programmer because it allows multiple people to
38:26
work on the same repository simultaneously without screwing things up, which as I'm sure you can imagine
38:32
tends to happen in old school um software architecture where even like a single semicolon at a place or whatever
38:38
could take the entire thing down. After that, you have a run and debug tab. I don't ever personally use this. Then
38:44
there's a remote explorer which is if you do connect with a variety of other servers or something like that, you can
38:50
actually show that information over here which is kind of neat. After that you have extensions. Extensions are pretty
38:55
popular. Um there are a variety of different extensions for a variety of different purposes. So you can download docker markdown linting. You could do
39:02
go. You could do language support for Java if you're using a different programming language. These are all the ones that I have installed over here.
39:08
And then down over here are ones that are recommended to install. And then finally you have testing down here at
39:13
the bottom. That little flask. I don't really use this. Uh most of the time the agent will construct its own test just as part of the process. This is all
39:20
stuff that used to take software engineers days in order to set up. Now we do so with basically one button,
39:26
which is incredible. Okay, obligatory. If you go to the top lefthand corner on a Mac, you'll find some anti-gravity settings up here. Pretty much the most
39:32
important feature here is this terminal command auto execution and then this review policy uh setting. Now, I'm sort
39:38
of accelerationist here. I just set both of these to automatic. So top one's always proceed, bottom one's turbo.
39:44
Essentially, uh, every time that the model does something that would typically require like a shell access or
39:50
terminal access or create something for you, um, you have the option to have it ask you whether or not you'd like to
39:57
review it or autonomously proceed. Now, I want my system to do all the work for me. Obviously, I don't want to have to
40:02
be checked in with every 5 seconds. Uh, and so I just set all of these to autonomously proceed. And I find that
40:08
when I do, that's when the real leverage kicks in. If you think about Visual Studio Code back in the day, sorry I say
40:14
back in the day here, we're talking like a couple of months with um Cloud Code or whatever, one of the most annoying things ever to me was how I would ask it
40:21
to do something and then I'd step away for a few minutes and I'd come back and I'd realize that 5 seconds after I ask it to do something, it ask me to
40:28
doublech checkck a review before it continued. That's a lot of wasted time. And so I trust most of these models in
40:34
their inherent judgment so long as I give them good enough framework to manage. Um, so I typically set review
40:39
policy and terminal command auto execution both to on. I should note there's some security issues with this. Veteran programmers, comps science
40:45
security people will probably look at me and be like, what are you crazy? But we're entering a new era where agents that tend to have significantly more
40:51
autonomy are significantly more productive. And I'm happy to make that trade-off. And that's a walkthrough of anti-gravity. Okay, opening up Visual
40:57
Studio Code here. I'm going to do this at a very high level because hopefully you see things are pretty similar. You have a file explorer over here. So we
41:04
have our folders, directives, and execution ones. Okay, there's an open editors page here, which if I had other
VS Code: IDE walkthrough
41:10
editors open, I would be able to see them. If I want to click on a file, instead of opening in the middle, it opens on the right hand side, and that's
41:16
okay. Reason why is because I just haven't opened up my little claude code or terminal or aentic workflow instance.
41:21
So sort of rearranges to look more similar to what you guys are used to. Now, typically what you actually have to
41:27
do in order to get this thing to run is you um need to have an agentic platform like cloud code installed in your VS
41:32
Code. doesn't really come natively or ship natively out the box although I'm sure uh you know cursor and and other
41:38
platforms and stuff do. So in my case this is now the interface for cloud code and I can talk to it just like I would
41:44
talk to the agent inside of anti-gravity. Super straightforward. I just find unless you specify that you
41:50
want to see more thinking it's not going to show you more thinking which can be a good or a bad thing if you'd like. Aside from that basically everything here is
41:56
the same. Okay just different UX. Left hand side you have your search tab you have your source control tab. This is
42:01
your run and debug tab. Here are your extensions. There's your remote explorer. There's some agent sessions
42:07
here, which is a local chat agent. This is VS Code trying to basically compete or do things like cloud code. You have
42:13
your tests down here. Then finally, you have um this is a custom extension I built called Cloud Code Chat, which basically just does the same thing as
42:19
what you guys are seeing on the right hand side of the page. So, we're only seeing this here because Aenta coding is
42:25
still pretty new, right? And so, people haven't really figured out one final convention for it all. That's why you see slightly different layouts and UX's
42:31
and stuff like that. Awesome. You guys now know everything you need to know about an ID in order to build cool agentic workflows. Let's move on. All
42:38
right, so you guys now know the ins and outs of most idees. Congratulations. Let's move on to self- annealing workflows. So in metallurgy, which is
42:44
basically the process and production of metals. Annealing is a process where you'll heat the metal and then you will
42:50
slowly cool down the metal to remove internal stresses and make it stronger. if you guys are really into animes, but
42:56
tons of old school animes where some dude dips a steaming hot sword in a big thing of water come to mind when I say
43:03
this. And basically, the heat allows the atoms to arrange themselves into a more stable structure. In the context of AI,
43:09
self-annealing means building a system that gets stronger every time it fails.
43:14
So, think about that for a second. Most automations that were built before this, whether it's in code or using a drag and drop platform like maker or nadn, you
43:21
know, if an error occurs in your scraper, let's say a button that you were scraping on a website moves or maybe the API figures out that you're
43:28
scraping and it starts returning a 429, which is a rate limiter, your automation will crash, the process will die, and
43:33
then you will lose a lot of money. But in a self- annealing workflow, these systems are anti-fragile. And I'm
43:39
borrowing that term from this lovely writer called Nim Taleb, if you guys didn't know. It's a great book. But to make a long story short, anti-fragility
43:46
basically means a system benefits from shocks. Just like the sword being dipped
43:51
in cool water, that sword benefits from the shock. And in the same way, our systems will benefit from errors. In our
43:57
case, if an error occurs in the agent, a self annealing framework means it will not crash. It will instead pause. It
44:03
will read the error message and then it will look at the code that caused the error and then hopefully it will fix it.
44:09
And then most importantly, it'll even rewrite both the script to handle the new edge case and then the directive or
44:15
the series of instructions to warn future instances about the rate limit and assure that it'll be able to handle it moving forward. Then it'll try again
44:22
and then it'll work. So that is the difference between a tool like maybe an NAN or make.com workflow that you constantly have to babysit for errors
44:28
and then what we are moving to which is the idea of an AI employee. Now in real life, an employee that comes to you
44:34
every time they hit a roadblock is super annoying, right? And I know this from experience. have had many of the sort, but an employee who runs into an error
44:40
and then has the ability to figure out the error, then go back into the company SOP database and update it so nobody
44:46
else hits the roadblock and then maybe run an educational session teaching everybody else in the company how to avoid it as well is a freaking star
44:53
player and those are people you want to keep on hand. So we are going to implement a feedback loop where your agent has the permission and capability
44:59
to rewrite its own directives and its own execution scripts based on real world feedback. This is the secret
45:04
sauce. This is how you build a system that you guys can leave running for weeks. Then when you come back, it's actually running better than when you left it. Let's see how this works in
45:11
practice. Okay, so just before we actually build in the very high level directive that allows our agent and encourages it to be self- analing, let
45:17
me just show you a brief visual demonstration of the concepts I was talking about earlier. So in metallurgy, we have a bunch of these chaotic atoms.
45:24
Then we hit some sort of annealing flame, dump it into some sort of cold liquid, and then we get a beautifully aligned crystal lice. This actually
45:31
happens in nature. I want you guys to think of our systems very similarly. We start out with some code that actually
45:36
may or may not be very good. I mean, these AI systems have been known to cut corners wherever humanly possible for
45:42
tokens saving reasons or for a variety of others. But the reality is we shouldn't just trust the code that comes
45:47
out the very first time. What we need to do is we need to stress test it. And so you can think of the stress testing as
45:53
basically being a failure filter where we have all these lines sort of going in all these different directions and we
45:58
just filter them. What ends up coming out is an efficient protocol. That's what we're looking for realistically
46:03
with a self annealing system. Another way of looking at it is day one you have some very rough highlevel bullet
46:09
pointbased directive of what it is that you want to do. Okay? And I don't know we're just graphing this basically but we just want it to go up and then go
46:16
down and then go up again. Okay? This is our rough directive. The very first time that we run it might work I don't know
46:22
20 30 40% of the time or something like that. What happens when it fails though is we start fortifying and if you build
46:29
self annealing into your agent, it will start doing things like adding automatic retry logic at specific points, adding
46:35
some sort of validation step at other points and so on and so forth to turn something that might just look like a little dainty piece of string into
46:42
something that is extraordinarily effective, efficient and then a lot safer than it was initially. So that's
46:48
what we are going to be doing. Now how do you actually do this? I talked about in our um editor how we'd start out with
46:55
a directives folder that we'd also start out with an executions folder, right?
47:01
Well, all IDE integrated development environments have one additional piece
47:06
of data that you can add to the agent that allow this to work about as well as
47:13
you know I'm talking about here. And if you don't have this initial prompt, initial uh sort of highle guidance,
47:20
performance tends to be significantly worse than if you have it. So my recommendation is have it. What this is,
47:26
this is basically an injected prompt that you always add or the system will
47:31
always add at the beginning of a whole conversation chain. And the way that this works is you define a file and
47:37
there are a variety of different conventions for these files. One is agents.md.
47:42
Another for claude codebased systems is claude.md. One for gemini based systems is
47:49
unsurprisingly gemini.md. Okay. Variety of these different conventions depends on the ID that you're using. And you
47:55
just give it one time an initial highle overview of what you expect from it. So
48:01
that right off the bat, starting from the very first prompt, sort of like your system prompt if you guys are used to using that. um it always knows sort of
48:07
like the the the structure of your framework and it understands what it means to be self- analing. If you guys
48:13
offer this, this is like steering the ship. And if you think about it, I mean, this is just a rough little map here. If I'm on uh I don't know, say that this is
48:19
the east coast of the uh United States and this is somewhere on like the west coast of Africa or something like that.
48:25
If I'm over here, okay, and I have a little ship and you know, my goal is to go over
48:31
here, let's say there's some port, right? If I give myself even a slight
48:37
range of possible outcomes, I might greatly overshoot where this is.
48:43
I mean, I could end up anywhere from here all the way up to like here to like here to here. So, what we do is at the
48:49
very very beginning stages, basically about as early on as humanly possible,
48:54
we constrain where that ship can go within very tight guard rails. So the probability of it
49:01
going somewhere that we don't want it to go is very very low. Okay. Viewed another way because we're going to be
49:06
doing some very big long things with this agent. It's very important that we get it started on exactly the right
49:12
trajectory. Which is why I always recommend having some sort of file like this. What does this file actually look
49:19
like in practice? Well, if you guys were keen, you'd notice in my anti-gravity environment, I had this at gemini.md.
49:24
And this is what is now injected at the beginning of every single instantiation of my agent. So what we do is we put
49:31
very highle instructions just describing what our environment is, how the DO
49:36
framework works and what we expect from the agent in terms of you know its ability to self- anneal. So if I zoom in
49:43
here a little bit, you can see that I'm saying hey you operate within a three
49:48
layer architecture that separates concerns to maximize reliability. LLMs are probabilistic whereas most business
49:54
logic is deterministic and thus requires consistency. The system fixes that mismatch. Three layer architecture layer
50:01
one directive what to do. It's SOPs written in markdown that lives in directives. So I'm actually telling it
50:06
where they are. Defines the goals, inputs, tools and scripts to use outputs and edge cases. Natural language instructions like you give a mid-level
50:12
employee. Layer 2's orchestration. This is you. Your job is intelligent routing. You read directives, call execution
50:17
tools in the right order, handle errors, ask for clarification, and update directives with learnings. You are the glue between intent and execution. Eg.
50:25
You don't try to scraping websites yourself. You read directives/scrape website and come up with inputs, outputs, and then run execution scrape
50:31
single site. Finally, we have our execution layer. These are deterministic Python scripts and execution environment
50:37
variables, API tokens, etc. are stored in env. That's this other file over here. It's a programming convention, but
50:43
basically rather than store all of your API keys in plain text, you just put them in one place so you never misplace them. Handle API calls, data processing,
50:50
file operations, database interactions, reliable, testable, and fast. Use scripts instead of manual work. We give
50:55
it some logic as for why. And then comes the self annealing. So you should self-anneal when things break. Read
51:02
error message and stack trace. Fix the script and test it again unless it uses paid tokens, credits, etc. In which
51:07
case, you check with user first. Definitely have something in there. update the directive with what you learned. An example is right over here.
51:14
And then finally, I actually give it a brief little self-ining loop. So you fix it, you update the tool, test the tool,
51:19
update the directive, and now the system is stronger than it was before. This is something that you need in order for
51:25
your agent to have context over how the system works. I'd always recommend having something along these lines
51:32
stored in a high level either agents MD, claude MD, Gemini.m MD, but obviously
51:37
look up the convention of your particular IDE. um this is just something that needs to be in the background 24/7 otherwise your agent can
51:44
figure this out and you know it'll try its best too but you can just run into silly initial logic where I don't know
51:50
you say hey do this thing and then it'll check out your executions folder it'll find something called the thing that you
51:55
want to do and then it won't realize there's actually a highle series of directives that guide it so this is a much quicker and easier way just to
52:02
ensure it always gets off on the right foot so that's the power of self annealing you guys are no longer just writing code you're basically creating
52:07
almost a living system You will start with a rough SOP. The agent will then try to execute it. It will then hit a
52:12
snag. It will then fix the snag. It'll update the SOP, optimize the code, and over time, the directive that you wrote
52:18
will evolve from this really rough sort of bullet point sketch into hopefully a significantly more reliable, very
52:23
optimized protocol that allows you to handle edge cases that you probably didn't even know existed when you started. I have workflows that have been
52:28
running for weeks now that I haven't touched at all. But if I look at the code today, it is very different from the code that we had initially. You
52:35
know, it's added different retry logic. It's added tons of validation steps. It's come up with like weird edge cases or catch errors that I didn't realize.
52:41
It swapped out one-off end points for bulk endpoints. It's optimized for speed and reliability. And the cool thing is the agent did all that. I had absolutely
52:47
nothing to do with it. So you have the theory, you have the architecture, and you also now have the self-improving mechanism. Let's get our hands dirty to
52:54
actually build some stuff. So as we all know, theory is useless with that execution. Time to build some workflows. You guys can technically build any of these in VS Code or a cursor or even a
53:01
notepad if you are super masochistic. But let me show you how I actually build these things from scratch. I will start by configuring a list of core
53:07
instructions for the model. Then we will set up a goal. I will give it some bullet points. Then it's going to craft its own directives and its executions.
Example building workflow from scratch
53:13
Okay. So I have anti-gravity open here. And what I want to do is I want to show you guys how to set it up completely from scratch. Assuming that you're
53:19
starting at the exact same place that I am right now. So when you open up anti-gravity, this is what it'll look like. First thing you need to do is
53:24
obviously find a folder or a workspace. I'm on Mac OS. So all I'm going to do is just click new folder. I'm going to call
53:30
this example workspace. Then I'm going to click create. Once I'm inside of example workspace, and this is really
53:35
important, you have to be inside of the folder. You click open. Now you have your workspace open inside of
53:42
anti-gravity. And the very first thing we want to do is we just want to drop a gemini.md
53:47
at the top level of the folder structure. Then you want to paste in these descriptions which I showed you
53:54
guys earlier on in the video. Of course, once you're done with this, you've saved it, you could say instantiate my
54:01
environment based on what's in Gemini. MD. So, we're basically instead of
54:08
having to make all these folders and everything like that on our own, we're just going to have Gemini do it for us. Odds are, you know, we've given it all
54:14
the information that it needs in this file. So, it's going to go through and then, you know, set up some folders and that sort of thing. Okay, it's gone
54:20
through and created a directives folder up top with an execution folder underneath. It's also created a git
54:26
ignore folder assuming that we were going to create a GitHub workflow or repository for this. Although I'm not going to be uploading to GitHub just for
54:32
the purposes of this demonstration. And now it's just going through to see if there's anything else. Presumably it's writing a readme that just explains sort
54:38
of what's going on, how the workspace is structured and stuff like this. Again, all just classic things that you would find in some sort of um GitHub workflow.
54:46
Okay, now that we're done with that, now that we have our directives folder and our execution folder, what we want to do
54:51
is we want to start creating workflows. So very first thing I'm going to do is I'm just going to ask it to do some very
54:56
very simple workflow for me similar to the workflow that you saw in one of my examples. I'm going to ask it to scrape
55:02
some leads for me uh with some highle bullet points and then uh it's going to guide me through the actual creation of said workflow. Okay, I have my
55:08
instructions right over here. Essentially what I'm saying is I want to create a workflow that scrapes leads in an industry I specify using a specific
55:15
Apify actor. All I did was I went on to Ampify, which is this big scraping marketplace, and then I just found one
55:20
of the actors here that worked for me. Then I say add to a Google sheet and then then finally I say give me a link
55:26
to review. So all natural language instructions very high level. As part of the scrape I first want you to scrape a test run at 25 leads. Then I want you to
55:33
verify how many of them are in my initial industry. Sometimes lead to scrape that are outside my scope. Just how filters work. If 80% or more of the
55:38
leads are okay proceed with scraping the full amount. If less than 80% are okay. Retry with different filters. So I'm
55:44
giving this entirely autonomously to um Gemini 3 Pro high. And I'm just letting
55:49
it run. So, this is going to occur in as close to real time as possible. I'm going to cut out any prolonged waiting times like when we run the Appify
55:56
scraper a couple of times as a test, but you can see that it's um initially set me up a workflow implementation plan.
56:02
And this is just an internal thing that systems nowadays always do just to improve their accuracy. They basically use this as like a checklist of tasks
56:08
that they do. One thing we can see right here is that it's ensuring it's asking me rather to provide an Appify API token
56:14
and then also a service account for Google Sheets access. So, I'm going to need to go on my end and actually
56:19
provide it some access, but I'm trusting that it will know that it does not have set access and it will guide me through
56:24
the process of adding it. What's really cool is that it's fully autonomous. It's doing all of this entirely without any sort of overview, just based off of my
56:31
initial ask. Okay. And as you guys can see, it's now created a first draft of my directive. The directive is basically
56:36
just an expanded version of the bullet points that I provided. But we have the goal, the inputs, the tools and scripts,
56:41
process, outputs, edge cases, and then some error handling as well. And then if I go down to the actual Python script,
56:48
you have the scrape_appify, then the update underscore sheet. So we have two different ones here. One is specifically
56:53
for amplify. It's a temporary script that it's created for that purpose. And the other is for the the Google sheet.
56:59
So we're not relying on the model to do the logic for us. We're just having it build the function. Do I know what this is doing? No, I have no idea. I've never
57:05
even looked at this thing. Some people would probably consider that a security error. And you know, any computer security people here, um, that probably
57:12
is a security error, but that's just how agents are. They're just building things extemporaneously for you. They're abstracting away all of the complexity
57:19
and then you get to use it as a business partner essentially. Okay, it's asking me for Appy and Google credentials now.
57:24
So, I'm just going to go and find some really quickly. Heading over to Appify down at the I believe it was bottom
57:30
left. I have settings, then API and integrations. And why don't I just create a new one here? Let's actually have that expire tomorrow so nobody
57:35
screws with me. First, I'm going to paste that in. Okay. And I provided both the API key and then a bunch of Google details as well. Okay, it's now doing a
57:42
bunch of integration. It's found presumably some errors with the authentication token I provided and then
57:47
um I don't know somev file here which contains all of my credentials. I'm just going to leave this let the model do its
57:53
thing and I'll worry about actually testing this thing when it's done. And it's now saying it's configured my credentials and updated the workflow to
57:59
support ooth. When I run the scrape for the first time it'll uh print a URL. I just need to open it in my browser.
58:04
Okay, test. Let's do 100 I don't know dental leads.
58:10
Let's see what happens. Now remember in a self annealing workflow the very first time you instantiate something it is the
58:16
weakest it will ever be because it has not actually gone through and you know done any edge cases or anything. It's
58:21
been just a few minutes since I started this. So probability of the model having figured everything out right now is pretty low. But that's the benefit of
58:28
the self analing workflow. I'm just going to ask it to run a test. It's going to go do all of the testing. It's
58:33
presumably going to run at some errors. Who knows? Might oneshot it. And if it does that's fantastic. Looks like we have actually already gone through and
58:39
started scraping which is quite nice. Um, but as we accumulate errors and as these errors occur, the only real cost
58:45
on our end is a few additional seconds, maybe 10 to 15 seconds while we wait for it to rectify itself and then our directives just get stronger and more
58:51
fortified over time. Another thing you can do just to get more visibility into what's going on is you can just move the terminal session down here to the bottom
58:57
of the screen. I'm hiding the leftmost side of it, but essentially that's just saying um, you know, nyx arrive at
59:03
MacBook Pro or whatever. So don't worry too much about that. But anytime you run any sort of console or uh terminal
59:09
thing, it's just nice to be able to see it actually occur live down here. And the benefit is when some issue occurs,
59:14
you know, it's not in this little tiny window. I can actually direct the agent and let it know, hey, you know, I'm running into some issue with the lead
59:19
scraping filter or whatever. And right off the bat, I'm seeing we're just scraping too many leads. So, you know, we're going over the 25 mark. I think
59:25
we're at 200 now. Hey, you're scraping more than 25 leads. So, I just entered
59:31
the request essentially guiding it saying, "Hey, there's something weird going on. you scraped more than 100 leads. To be clear, I didn't need to do
59:37
this. It would eventually figure this out on its own, but I figured if I could save myself 30 seconds now, might as well. Looks like it figured out the
59:42
issue. It's now rerunning the scrape with a strictly enforced limit of 25 leads. One cool thing that Gemini will
59:48
do is it will wait for command completion up to a pre-desated amount of time. In this case, it's basically
59:54
checking every 30 seconds to see how many of these leads we've scraped and stuff like that. So, it's almost like an internal weight. If you guys are
1:00:00
familiar with make or nadon, um, what's cool is it just creates the weights on its own. So if you have a process that it knows is going to take a fair amount
1:00:06
of time to scrape in this case ampify is the obviously a limiting factor here can only run as much as the server uh space
1:00:12
and RAM and stuff like that allotted to it. It will actually intelligently try and check in at certain amounts of time.
1:00:19
So that's what it's doing right now. Okay. And it's actually gone through and then generated me a big JSON with all of the lead information right here which is
1:00:25
pretty cool. Um as you can see here we don't just get the email address, the first name, the last name. We get stuff
1:00:31
like all the keywords, we get the phone numbers. we get the headlines and so on and so forth. So pretty good as a first
1:00:36
pass. Now let's make it better. Now I should note that while it is building said workflow, this is a process that takes a few minutes. You can just step
1:00:41
away and you can do whatever the heck else you want. You can actually have multiple anti-gravity instances developing multiple workflows
1:00:47
simultaneously assuming that you have the compute and the tokens or you could have anti-gravity open in one window, Visual Studio Code open in another
1:00:53
window and so on and so on and so forth. The cool thing about using the D loop is whereas with typical code bases, the
1:01:01
codebase is typically concerned about overwriting a file that it's working on, when you're working with multiple
1:01:08
different anti-gravity instances or multiple different Visual Studio Code instances, and you've made these
1:01:13
workflows very granular so that you only work on one directive or a set of workflows at a time. Essentially, you can do however many of these things
1:01:19
running 24/7, however many of these assistants on 24/7. they're each going to just be doing their own thing in the
1:01:25
background. Um, as long as they don't work on the same directive. So, as long as you maintain different directives as
1:01:30
sort of your own standard operating procedure, um, you're good. And in this way, you can have potentially 10 or 15
1:01:35
AI employees working for you at the speed of light. All right, I went through diagnosed an issue with what
1:01:41
looks like a location filter. The locations needed to be lowercase or something like that. Again, I don't really give that much of a crap because
1:01:46
that's just what the model does. The model goes through the process. It tries giving it a run. It self-reinforces and
1:01:52
self-anneals until you have a really airtight workflows that works every time in seconds. Now it is reading the output
1:01:58
JSON to verify if the leads are relevant. So in our case, we're going for dentists in New York and it's just really quickly double-checking. And now
1:02:04
that it's gone through and verified that over 80% of those leads are what we expected them to be, it's running a full scrape for all 100. Okay, it's now
1:02:10
asking me to sign into Google Sheets. So that's what I'm going to do. Now that I've signed into Google Sheets, it's gone through and actually connected it
1:02:16
and then dumped all the leads in there. And now it's getting the console request and then notifying me of the completion.
1:02:22
Cool. So I got the list right here. Just going to open up that puppy. And as you guys can see, the list is now set in the
1:02:27
way that I wanted to. So you know, we have a bunch of columns here. Full name, job title, LinkedIn, company name, we
1:02:33
have their email addresses, first name, last names, and so on and so forth. So when I created this workflow for the
1:02:38
demo purposes at the beginning of the course, I did so in the exact same way that I just did here. I mean, I just gave it some very highle instructions.
1:02:45
uh you know it started using the wrong keywords or something like that. So I paused it and said hey actually
1:02:50
lowercase the keywords or something and then just tested ran evaluated its own errors and then annealed the workflow
1:02:56
until it was really good. And so now we have an airtight scrape leads workflow right over here that actually goes
1:03:01
through that whole process. Now let me show you how easy it is to build on additional functionality onto a flow like this. First I'm going to change the
1:03:08
model from Gemini 3 Pro high to Claude Sonnet 4.5. I'll do the thinking model just cuz it's a little smarter. And I'm
1:03:14
doing this because I just want to show you guys that you don't have to remain constricted to any one individual model or architecture. This actually works with basically every cutting edge coding
1:03:20
model today. Then what I want to do is now I have these leads, but I don't just want these leads. I also want to enrich
1:03:26
all the leads that are empty. Um I went back through here and I found that, you know, of the 100 leads that I scraped,
1:03:32
um it looks like I I found I don't know 90 or so emails, but there's 10 here
1:03:37
whose emails I don't have. So what I want to do is I want to send this to a service called any mailfinder which I
1:03:42
just use for all of my email enrichment and validation services where essentially I can just pump in the name
1:03:47
of a company and then I can go and actually find email addresses at it. This service has an API of course which is quite annoying and complicated to
1:03:53
deal with. Not that they did a bad job with the API or anything that did a great job. I just don't like having to integrate APIs myself anymore. So what
1:03:59
I'm going to do is I'm going to give it some highle instructions just asking hey now what I want you to do is change the workflow. So, in addition to this, um,
1:04:06
you know, I want you to add on, uh, enrichment for all of the rows that didn't have any emails in their email
1:04:11
column. What's really cool is I'm also going to do this not through typing. I'm going to do this through my voice. So,
1:04:17
I'm using a simple speech to text platform called Aqua. When I hold down the Fn key on my keyboard, you see this
1:04:23
little thing popped up at the very bottom. Well, what this is doing is transcribing everything I'm saying into a text box. So, there it is. So, what
1:04:29
I'm going to do is I'm just going to speak to this just the same way I'm speaking to you, and I'm going to ask it to help me build out an additional piece
1:04:34
of functionality for the workflow. This worked great, but some of the rows do
1:04:40
not have a corresponding email. What I would like you to do is to modify this workflow and add on email enrichment
1:04:47
portion to it. I want to use a platform called any mailinder to do the enrichment. After you generate the
1:04:53
Google sheet, I want you to identify all of the rows that don't have emails. And
1:04:58
for all of the ones that don't have emails, send them over to any mail finder for enrichment. If you find the
1:05:04
emails, then update the original Google sheet. If you don't, no worries. In either case, send the Google sheet over
1:05:10
to me. Cool. So, as you guys can see, pretty unstructured text dump here. I mean, I told it that I did a good job,
1:05:16
and now I'm just going through and giving it some more information about how I want the workflow to be structured. So, it's going to create a
1:05:22
plan for me and actually go and research the any mailinder API. It'll update the directive to include an email enrichment
1:05:27
step. Then, it'll create some scripts for email enrichment specifically and then update the workflow to integrate set enrichment. And now, it's just
1:05:33
researching the email finder documentation. So, obviously, I'm going to have to give it an API key. Um, it hasn't asked me for an API key yet, but
1:05:40
but while I'm not the sharpest tool in the shed, I know that you typically need to provide API keys to get anything done. So, I'm going to head over here to
1:05:45
API and then I'm going to give it my key. Um, this just plain text exposes the key. So, I'm just not going to show that part to you. I'm just going to
1:05:51
click on this API key, copy it over, and then give it to the model. Okay. And I just added the key to the ENV file,
1:05:56
which is just the programming convention where you store all of the keys and API tokens and whatnot. And I'm now telling
1:06:02
it, hey, I've updated the envinder API key, so you're all good. It should now be able to do more or less everything it
1:06:08
needs on its own. I don't like um Claude Sonnet 4.5 thinking as much as Gemini
1:06:13
just for the purposes of this, but it does work super well and you don't necessarily need to just stick to one model all day. Rate limits are very real
1:06:20
and so most people that are using anti-gravity fall in love with it so much and just have it run these self- analing workflows that you inevitably do
1:06:26
hit a rate limit. I just wanted to give you guys some alternative ways to do the same thing. You can of course also use um GPT codecs. What's really interesting
1:06:32
is as the model does its self annealing, it does things like create temporary debug outputs so that it can read
1:06:38
through the outputs of its own issues. It'll create temporary files like um I don't know leads full test leads.json
1:06:45
and stuff like that. Um I should note that this will eventually muck up your whole uh folder if you're not careful.
1:06:50
So you could also offer some highle instructions asking it to delete um like data and outputs and stuff like that
1:06:56
after a user has verified something. Um, I just like doing this manually because sometimes there is some juice buried in these things, but your mileage may vary.
1:07:03
Now, one of the main reasons I wanted to do this demo is because I wanted to show you how you could literally just ask it
1:07:08
to do something better and then it would do something better. And so, what we're doing right now is we're finding email addresses as uh mentioned for people in
1:07:15
our Google sheet that didn't have emails, right? But it's taking a long time. And so, when I did this just
1:07:20
earlier a few days ago, I literally just said, "Hey, this is taking a long time.
1:07:26
Can we go faster? I sent that over and what it ended up
1:07:31
doing is it ended up doing a self- analing loop and finding a batch or bulk endpoint which allowed it to query all
1:07:38
of those emails simultaneously instead of just like one one at a time like here. And what you do is you literally
1:07:43
just continuously ask, hey, can you do this faster? Hey, can you do this faster? Hey, can you do this faster? And
1:07:49
like the fifth or 10th time, your workflow is now operating like a 100 times faster than it was before. So it looks like in this case it's added some
1:07:54
sleep time between requests. It's also doing some sort of concurrent request thing which is pretty cool. Going to
1:08:00
give this a click. Now we have our full Google sheet here. And it looks like instead of 90 emails, now we have 95. So
1:08:05
it's actually gone through and done some enrichment. But that is not fast enough. So I'm literally just going to say faster. And let's see what happens next.
1:08:12
You can see it's now reasoning about how to do things faster. And it stumbled upon some hypothetical method where I could use Python's concurrent. Futures
1:08:19
threadpool executor to make multiple API calls in parallel. Do I know what that means? No. But I do know what that means
1:08:24
for my business, which is faster. Give it a try.
1:08:29
And as we see, that completed in literally just 2 or 3 seconds as opposed to the whole minute that it took before.
1:08:36
That's pretty wild. I wonder if it can go even faster. It looks like it's found a way to go from 10 times faster to over
1:08:42
30 times faster, plus using the Google Sheets bulk API in order to do the job. Wild. Now, because I'm just curious, I'm
1:08:49
going to remove all of the email addresses in this sheet. And then I'm just going to see how quickly you can do it. Let's go email. Then we'll say,
1:08:55
"Okay, I removed all of the emails. I want you to run this on all of them concurrently so we can see how fast you
1:09:00
do them all." Okay, it went through and then found 54 emails, which is pretty solid. Um, I should note that, you know,
1:09:07
I had more emails before cuz I didn't enrich them using an email finder. I found them in a different method. But yeah, I went through and it did them
1:09:13
all. Still not super happy. What could you possibly do to make this even
1:09:19
faster? Okay, it's found tons of different opportunities. We could batch the Google Sheets updates, increase concurrent workers. I don't know what
1:09:24
any of this crap means, but I'm just going to tell it to do it. Okay, and it looks like it just did the whole search now in like 2 seconds or something,
1:09:31
which is pretty crazy. Yeah, and it essentially did the exact same search that I would have just done manually. And it would have taken me a fair amount of time. I don't know, maybe like 5
1:09:37
minutes or so. Then it automated and it still took a fair amount of time, couple minutes into something that literally took like 5 seconds to do start to
1:09:43
finish. So, this is what I mean when you just you just continuously ask, can you go faster? Can you make it better? Can you keep pushing? Essentially, it will
1:09:50
continuously work to find the most efficient version and continue to reinforce the code until you have something that's basically foolproof.
1:10:11
Okay, sorry about that. Just had to grab some tea. Um, good news is when I came back, looks like everything is all good
1:10:16
to go. So that is the power of using an agentic workflow. You can just get up, do whatever the heck you want, come
1:10:21
back, and if you give it a difficult enough task, it'll go and do it for you. Okay, but this is just a demo workflow. I mean, this is the same thing that I
1:10:27
built out in the example. So why don't I give you guys a new workflow, and then we can just build it together from scratch. I'll show you guys how I
1:10:33
implement it on the right hand side. Um, I run a YouTube channel and it's an okay YouTube channel. Can't exactly complain.
1:10:40
You know, 225K subs is pretty good. I'd like to be bigger. And so as part of my desire to be bigger, what I want to do
1:10:46
is I want to come up with a way to identify outliers on YouTube. The reason why I want to identify outliers is other
1:10:53
people's videos that perform really well are a good indication as to what sorts of videos I can create to also perform
1:11:00
very well. And so this sort of outlier detection is typically done on mass with software platforms like one of 10 and so
1:11:06
on and so forth. Uh, Vid IQ, you know, there's just so so different uh so many of these platforms that it's hard to
1:11:12
keep track of them. And, you know, I'm using that one right now. That's why it says one of 10 in the top rightand corner. But what if instead of me, you
1:11:17
know, using a paid tool for this, I just came up with a workflow on my own. Well, let's do it at a very high level. I
1:11:23
guess we're going to have to start by scraping YouTube videos, right? For I'm not even going to say a particular
1:11:28
search term. I'm just going to say for channels similar to my channel, so the model can just do whatever the heck it thinks is best. And then I will just
1:11:35
assemble a list of outliers. Let's do maybe 10 outliers. Um, we'll keep it really small and minimal for now. And
1:11:40
then what I want it to do is I want it to show them to me in also a Google sheet. It'd be really cool if I could
1:11:46
also get the thumbnail. Um, so I'm going to see if I can get the thumbnail and then that way I'll have a list of outliers presented sort of on my desk
1:11:52
every morning with titles, you know, the thumbnails, maybe like the outlier multiple, maybe some additional information. Maybe I'll grab the
1:11:57
transcript as well, just cuz that would help me with my own content flow. So that is my vision. Can I effectively translate that vision to the model?
1:12:03
Okay, I'm just going to use a different one. I'll use Gemini 3 Pro High. Again, I should note that you can also use other models like GBTOSS120 bill. What
1:12:10
I'm going to do here is I'm just going to use natural language. Great work. I'd like to build a new workflow. This one
1:12:15
will be an outlier detector for YouTube. To make a long story short, I run a YouTube channel and I'm interested in
1:12:22
finding high-erforming outliers in my niche.
1:12:28
I'll give it my YouTube channel now. Nick Sarif right over here.
1:12:33
This is my YouTube channel. At a high level, I'd like you to scrape
1:12:39
YouTube videos posted in the last 48 hours for
1:12:47
similar topics as I create
1:12:52
and then assemble them to me in a Google sheet. I want you to include things like
1:12:58
the title of the YouTube video, a link to the channel, um the outlier multiple, which is how
1:13:06
much that video has outperformed other videos on the channel. Uh I even want to
1:13:11
see the thumbnail in my Google sheet if possible. And ideally, I'd also like a transcript
1:13:17
of the full video alongside a summary of the transcript, highle notes that I can
1:13:23
use to quickly review and then ideulate my own content. So, this is essentially a product that I
1:13:30
am asking it to create here. And this product might have taken many many weeks or months of dev time back in the day to
1:13:36
create, but I'm essentially having it replicate the functionality of these whole software platforms now, right? And for me as somebody that doesn't really,
1:13:43
you know, I don't do front end, I don't even really do backend. I mean, I mostly just drag and drop and and now do agenda
1:13:48
workflows. This to me, like it's the same thing. I'm just asking it to do a task for me. So, all I need to really be
1:13:53
able to do is just formulate a task or really think about it. I need to be able to find things that are worthwhile doing
1:13:58
that actually improve my business. And then I just need to be able to interpret that at some sort of high level in a
1:14:04
list of bullet points. And even if I screw up, it's still going to do a pretty good job. Okay. So, what's it doing right now? It's starting by
1:14:10
analyzing the ENV. Then it says, "Search the web for finding an Appify YouTube scraper that can get the last 48 hour
1:14:16
view count and channel average." It's now looking for some Python libraries to scrape YouTube transcripts. And it looks
1:14:22
like it's deciding to do YouTube, which is pretty cool. Now, it's also going to figure out um some additional things and
1:14:29
anyway, it's refining its implementation strategy. Let's see what it does. It's asking me to install some Python dependencies here. So, I just clicked a
1:14:35
button and it looks like it started by creating a highle directive here. The goal is to identify high performing
1:14:40
YouTube videos or outliers in the user's niche from the last 48 hours, calculate outlier scores, and generate summaries
1:14:45
to aid content ideation. That's pretty cool. Um, and then over here, we actually have the workflow itself, which
1:14:50
is nice. So, we're going to identify keywords, scrape recent videos, calculate the outlier score, and then fetch the transcript and summarize for
1:14:56
outputting to a Google sheet. This honestly is basically what I would have created in Maker Nadon. Uh, it just
1:15:01
would have been node-based. So, actually would have created nodes that do all the information. you know, I would have had like a keyword identifier. Then I would
1:15:07
have had like a a scraper and then I would have had um you know, something that calculated the outreach score and and outlier score and whatnot. It's just
1:15:14
all of the stuff I would have had to manually configure would have been sort of drag and drop. Would had to like, you know, test and retest and do this big
1:15:21
loop over and over and over again. Probably would have taken me several hours and that's just to do the back end. Uh what's cool is, you know, as you
1:15:26
can see here, we're already at the point where we've written a Python script to do the scraping of the YouTube outliers. Now, it's actually going to go and test
1:15:32
it as well. Okay. And now over here as you see one of my tasks specifically asked, hey can you summarize using AI?
1:15:38
So in this case it said open AI GP4 similar to generate a summary summary format. What makes this video viral?
1:15:44
Three to five bullet points and some content ideas for how Nick can adapt this. This is cool. Didn't even think about this. Um but you know I should
1:15:49
note I don't have my OpenAI API key in there and I actually don't want to use OpenAI. So this is me now exerting some of my top down intelligence and I'm like
1:15:55
hey you know I want to use Claude instead. So what I'm going to do is I'm going to say let's use Claude. Here's my
1:16:02
API key or actually API key inv.
1:16:07
I'm going to go through grab my API key and then circle back. So in this way you can make some pretty easy decisions at a
1:16:13
very high level. I mean you know it's giving me a bunch of different software platforms I could use. Obviously if you know or have any specific preferences
1:16:19
around software platforms you can just use these. Looks like it's now just updating the script to use this anthropic key so I can run through top
1:16:24
to bottom. And I should note here I mean this is saying use this or similar to search for those keywords. So, it
1:16:30
doesn't actually have like a defined one yet. And that's where the selfing is going to come in, right? We're going to use just whatever the heck we can. And
1:16:36
then as we get the results, um, we're going to kind of proceduralize it and then stick to a specific scraper. Uh,
1:16:42
and then the good news is here too, you know, these third party scrapers often go down for whatever reason, they get
1:16:47
rate limited, API access is deleted, or another scraper stop working. And so when you give the agent the ability to
1:16:54
choose alternatives, it'll use its own ability to reason to, you know, slot in new workflows as necessary without
1:16:59
actually causing an error, which is pretty sweet. Looks like it stumbled upon the keyword AI automation. That's pretty cool. Let's just take a look at
1:17:06
some of these videos that it's searching up. Looks like it's doing so on mobile, which is neat. This is one of them called the future of work, where will
1:17:11
our children be prepared? Pretty neat. I'm seeing this is taking a long time. I don't like that it's taking a long time. I mean, it's been what, 3 minutes since
1:17:18
I started. So, I'm just going to stop this and say, "This is taking forever. Can you do it faster?" Idea being I
1:17:25
don't like what it's doing. This probably is not going to be my preferred workflow. So, I'm just going to ask it, hey, this is good and all, but I want
1:17:31
you to modify this to do better. Looks like it's now implementing some sort of multipprocessing, which is pretty sweet. Looks like it's now doing some
1:17:37
parallelizing, which is pretty neat. Just got to love self- annealing, man. Like, this thing is just doing everything um on its own. I give some
1:17:43
very high level instructions. I'm dissatisfied with how it performs high level and then it just goes. Obviously, future versions of like the um directive
1:17:50
orchestration execution model should include like highle instructions that continuously say hey if you could do
1:17:56
something you know test something then ask yourself how can I make it faster use parallel processing and multiple
1:18:02
threads and stuff like that and you know a lot of the stuff's going to be baked in out of the box. What's cool is like I don't need to know any programming. I
1:18:07
just say hey output is not what I wanted so fix it and then it finds the how. And that's just how good companies work
1:18:12
really, you know, like uh as my company has many clients that want a variety of
1:18:18
things from, you know, like lead generation to help on their sales end and stuff like that. When they ask me for things, they don't say, "Hey, Nick,
1:18:24
can you implement this 4,000step workflow that we've met designed and do it our way?" They say, "Hey man, here's
1:18:30
my problem. So here's the what. I want you to figure out the how and then go and do it." That's exactly what these
1:18:35
agents are doing. Just taking a look at the back end here. Uh what it's doing is it's spinning up a number of Apify actors simultaneously and then it's
1:18:42
using these to scrape a bunch of videos concurrently which is pretty wild. Okay, so speaking of parallelism, what I want
1:18:47
to do next is show you guys how to actually do multiple of these simultaneously just like I was talking about earlier. So I have um anti-gravity
1:18:53
open right now. What I'm going to do is I'm going to do this next leg in Visual Studio Code and I'm just going to separate this into two parts. There'll
1:18:59
be a page on the left and a page on the right. Okay, so I'm just going to go into example workflow here and then I'm going to open this up. Let me just
1:19:06
readjust this a bit. Maybe zoom out just a tad so we could see both of these simultaneously. Hopefully you guys can still see what's going on here. But
1:19:12
basically now on the left side I have my VS Code open. On the right side I have my um anti-gravity still working on that
1:19:19
task. This is good to do especially on like longer tasks that take you know more time. So I'm going to do next is
1:19:24
I'm going to go and I'm going to find uh Claude Code. Just open that up and then
1:19:29
open this up. Kind of annoying I got to do that twice, but it is what it is. I'm going to open up Cloud Code and then I'm just going to start working on another
1:19:35
system. First things first, um, with Claude Code, I always like going claw- verbose. This just gives me more detail,
1:19:41
similar to, um, anti-gravity in that I get a bunch of information, which is nice. So, you can see here some things
1:19:46
are erroring out. It's giving me some outliers in the Google sheet. That's cool. So, so it should be almost done. But, you know, I don't want my
1:19:52
productivity to be just be bottlenecked by one. So, I really liked um this YouTube outlier workflow. Uh what I want
1:19:58
to do next is I want to build a brief system that um I don't know like as part
1:20:03
of my work I typically have to send people emails and one cool thing to do
1:20:09
when you send a person an email is to give them something customized that improves their business alongside with a cold email. So what I want is I want a
1:20:16
system that will take all of the leads from the previous workflow. This directive scrape leads and then you know
1:20:23
I think we got the website there right? So, I want to go through the website and I want to create like a customized slide
1:20:29
deck. That's what I want to do. Maybe in Google Slides. Okay. Okay, I'd like you to familiarize
1:20:35
yourself with the workspace and then create a workflow that starts by taking
1:20:41
in a Google sheet URL and then for each row in that Google sheet, searches up
1:20:46
and performs deep background research into the lead, goes through their website, scrapes it, searches up
1:20:56
three or four combinations of their names and various things about them and essentially builds a dossier on that
1:21:01
person. And then I want you to take all that information and use it to create a custom Google slide deck pitching them
1:21:07
cold email lead genen. I want it to be pretty meta. Okay, I'm going to now ask this to build
1:21:14
my workflow on the lefth hand side and on the right hand side I'm going to be looking at the results of this workflow.
1:21:19
So looks like it has successfully built and optimized the workflow. It runs in parallel significantly speeding up the process. So let me take a peek at this.
1:21:26
So you see here clearly did not work the way that it wanted it to. Um, it did find me a bunch of cool outliers, which
1:21:31
is nice. But yeah, I mean, this stuff's sort of all over the place. I'm not going to lie. We We don't have the URL.
1:21:37
So, it looks like we need to allow access to fetch URLs. Oh, nice. Nice. Actually, we did get the thumbnail. Oh,
1:21:42
that's really cool. Can I make this bigger? Maybe. Maybe I do this. Oh, okay. Yeah. Yeah, I can make this bigger. Sick. Um, sorry. I can only make
1:21:50
it proportionally bigger. So, now I got to make it wider. Let's do this.
1:21:55
Okay, that's actually pretty cool. Um, it looks like the issue is I don't get the transcripts right now, which is kind of annoying. Um, I also obviously don't
1:22:01
like how long it took just to do that whole thing. So, h yeah, so everything here worked well, but obviously not as
1:22:08
well as we would like because we don't get the summary and we don't get the transcript. It also took forever. This is great, but I have three problems. The
1:22:15
first is that it took significantly longer than I wanted it to take. Probably because it looks like you scraped every individual channel for all
1:22:21
their videos to calculate the outlier score. um search Apify to see if there are better scrapers for this purpose
1:22:27
that might be able to do what I want you to do much quicker. Alternatively, find a way to rearrange
1:22:32
the flow so that it doesn't take this long. You probably don't need to search through all of the videos and the channels or whatever in order to get
1:22:38
that information. The second problem is I don't see a summary, meaning you were unable to get the transcript.
1:22:44
So, find a way around that as well. Everything else looks awesome. We have a good thumbnail. All the rest of the
1:22:51
information is great. Um, so that's the only thing you need to change.
1:22:57
Oh, actually I just had a thought. Oh, one more thing. Uh, sort the list so that the highest outliers are up at the
1:23:03
top. Cool. So, I'm giving it a ton more information. Let's go to Visual Studio
1:23:08
Code. Now, the thing about, um, cloud code is you typically have to allow edits and stuff like that. So, that's
1:23:14
kind of the annoying thing uh, with some of these. I mean, it's annoying in so far that like they want to be safe and secure and they don't want Asians to I
1:23:20
don't know, like hack the whole internet, which I understand. You know, I think there are some legitimate concerns surrounding deception and AI
1:23:25
models and whatnot. Uh, but yeah, I mean like I obviously just want to I want to auto approve this stuff and just have it run 24/7. So, there are ways to to do
1:23:32
this. I'm not doing that right now, but um yeah, you know, typically you just need to keep your eye on the cloud code field and just make sure that it is
1:23:37
actually doing what you want it to do. So, it's cool because these are working on fundamentally different workflows, right? like one of these here is doing
1:23:45
um you know scraped YouTube outliers and the other one here is doing uh let's see here deep research pitch and because
1:23:51
they're focusing on different things okay I can actually have them both work simultaneously I don't need to be like
1:23:57
you know rectifying code bases or merging or anything like that so realistically like a single developer
1:24:02
can now build you know a dozen uh different workflows simultaneously and then most importantly we don't just
1:24:08
build the workflows we also use them as you guys were seeing earlier I literally just say Hey, I want you to go scrape me
1:24:13
5,000 dental leads. And it'll go and it'll do so using its interpretations of my asks. Now, up until now, I have set a
1:24:20
maximum of four of these running simultaneously. One on the top left, top right, bottom left, bottom right.
1:24:25
Personally, I find that my attention starts to wayne after that. And honestly, like what's the point of having more? Like more isn't necessarily
1:24:32
always better. Realistically, unless a single build is taking a really long time. I mean, I I rarely even need two.
1:24:37
I work on one while I go do something more economically valuable like you know send emails or go on the phone. Um but
1:24:43
you know like the upper limit for this stuff realistically you have a bunch of monitors and you're like very careful is you could probably orchestrate the the
1:24:48
the functioning of like 16 different orchestrators simultaneously which is sweet. I don't really like how this is
1:24:54
smaller. Can I just make this bigger? I think just Mac does this automatically which is kind of annoying. I don't know
1:25:01
if I can make it any bigger down here. No. But I can make it bigger up here. So
1:25:06
I I shall Thank you, Mac. Nope. You just moved down again. Darn.
1:25:14
That's the darnest thing. You have Galaxy brain intelligence and then you can't make your windows a fixed size.
1:25:19
Okay, as you see on the left hand side, it's doing some some library stuff. And on the right hand side, it's actually running an optimized batch script to
1:25:25
reproduce this much faster. That's pretty cool. Let me just delete some of these tabs. Okay. I mean, I got to keep this tab open for sure. Um I I do prefer
1:25:33
it like this, right? cuz like most of the information that I'm seeing in the middle isn't really all that useful to me anyway to be honest. I don't as a
1:25:39
non-coder here, I don't really do anything like that. I did see that there is a run full workflow down here which
1:25:44
is interesting. So I'm wondering if maybe that was from this um I should tell it not to have flows like run full
1:25:51
workflow just cuz that's not very descriptive. It needs to be very like related to the specific task, but still
1:25:57
okay. Okay, looks like it's now identifying the specific uh data inside of the sheet. Mesh is probably going to
1:26:04
try mapping the columns now to its own function, which is cool. And then it's implementing some sort of search functionality here. I don't know how
1:26:09
it's going to do it, but it is going to find a way to do it. Meanwhile, on the right hand side, we're running an optimized batch script to figure out
1:26:15
exactly um you know, how fast we can get this process. I will say it is still taking its sweet time. I don't really
1:26:21
like that. Looks like it's crawling almost 400 pages. So, there has to be a much faster way to do so. Maybe we could
1:26:26
use the official YouTube API. I don't know, throwing out some ideas, but I'm going to ask it to go faster. Looks like
1:26:31
it's now created a dossier folder. Looks like it's now come up with some research summaries, which is cool.
1:26:38
Okay, this is a bunch of information all about this specific person. Looks like it's trying to use uh some sort of
1:26:45
search service called Tavi, which I don't have, but uh did go through the
1:26:50
website, perform HTTP requests, and everything like that. So, very, very intense dossier, which is really nice. And what we can do is we can generate
1:26:56
these per lead and then we can use it to create something really cool specifically for uh you know this person that we're reaching out to. This sort of
1:27:02
thing back in the day might have taken you you know 15 or 20 minutes per person. Now it's something that we can presumably parallelize and then do you
1:27:09
know hundreds of them in the span of like a few seconds. Meanwhile over on the right it looks like we're not using
1:27:14
Amplify anymore for time reasons. I said that hey this is still taking too long. Previous run took 6 minutes. This one's
1:27:20
taking around 1 minute. So it's just finding a faster alternative. and looks like it fixed whatever its issue was.
1:27:26
Okay, so as a first pass, uh this is what the um pitch deck looks like.
1:27:31
That's pretty cool. I mean, I didn't even give it a template or anything. Just went, which is wild. I mean, that
1:27:36
is just insane. Wow, look at that. Look at that. You build something rare in Brooklyn's crowded dental market, a
1:27:41
holistic studio experience that commands premium positioning, but with only one testimonial visible and no new patient offers on your site, you're likely
1:27:46
losing 50 to 70% of visitors to competitors with less compelling practices. your mint condition membership program is right FICOI and
1:27:54
AADSM qualified partner. You know, if you adjusted the wording and you kind of made this according to a template as
1:28:01
opposed to what it is right now, which is it just coming up with its own template, this could do extraordinarily well. And I think we're very very close
1:28:07
to like a high quality system that does this sort of thing entirely autonomously. So, that's pretty cool.
1:28:12
Um, I don't like how some of these things are on two lines, so it should probably adjust that. So, I'm just going
1:28:20
to paste an image and I'll say some issues with how things are laid out. Avoid spilling things over like this.
1:28:26
The text overlaps. Also, some of the text actually goes past or bleeds past the limits of the slide. Adjust that.
1:28:35
Finally, use interfont everywhere and then find highquality pitch decks
1:28:44
and then just duplicate their design instead of trying to come up with some on your own.
1:28:50
Checking the right hand side here. Looks like we are now done. That's pretty cool. We now have the Google doc. So
1:28:56
going to take a peek at this in a second. Okay, let's take a look at these YouTube outliers now. Now obviously
1:29:02
three is not good. So there's some issue here with the YouTube DL DLP I think it was package. Uh look does look like we
1:29:09
are getting some videos. So something is working there. Maybe we ran into a rate limit. I don't know. Hey, I only found
1:29:14
three rows here. Uh there was some issue with the scraping. I want at least let's say 10 outliers. Okay, looks like I ran
1:29:20
into a rate limit here. So we're just switching from um Gemini 3 to this. As
1:29:26
these tasks get longer and longer and longer and the agents become better to do said self annealing on the building
1:29:32
of the workflows, uh eventually you're barely going to be required whatsoever. You'll be out signing deals, doing
1:29:38
whatever the hell it is that your business does, and you just check back in on said workflows as they're being
1:29:43
generated. I think we are really at the point now where you know at least like an automation agency like myself can
1:29:48
essentially automate the production of all of the workflows. Just a matter of finding a way to um you know host them
1:29:54
and deploy them on actual customer steps. So that that's sort of like the the main issue right now. Um anyway this
1:30:01
looks pretty solid. We are still running into that line issue. So I'm just going to take a screenshot here.
1:30:08
Send it back. Is this interfont? Yeah it is. Yes. Inter font. Still spacing
1:30:14
issues though. Looks pretty good.
1:30:22
Aside from that. Okay, we now have a Hi Alice. I know we haven't met yet, but I
1:30:27
used to work in consulting. Came across Brooklyn Men Dental. Spent around 30 minutes researching your practice. Found some interesting opportunities worth
1:30:32
sharing. That seems pretty cool. Bluntly, I'd like to make you more money. Your site has one testimonial and no new patient offers. You're bleeding
1:30:37
60 to 70% of visitors to competitors who do. That's cool. Problems? Uh, looks like we're running into an issue with
1:30:43
the um I don't know. We're like adding one twice, but that's okay. We'll just take a screenshot of that. Why this works for
1:30:50
you. That's cool. Research depth summary. This 5,000word dossier represents the same research process I used before writing a single email.
1:30:55
Here's what 30 minutes uncovered. Finally got questions. Let's chat book time on a calendar. Shoot me an email. Okay, I'm just going to presume that
1:31:01
we're going to be including um that information in said email. Interesting.
1:31:08
This is cool. Um, I like this. Yeah, I like this.
1:31:14
Obviously, we got some weird spacing going on, so we can fix this pretty easily. So,
1:31:20
two issues, only two issues left. One, right now, you're double spacing all bullet points,
1:31:29
which looks odd. Two, how do we screenshot this?
1:31:35
You're doubling up the one and one. Cool. Let's just have that fixed. Cool.
1:31:41
That looks nice. Looks like it even added a little wavy. Former consultant. Couldn't help myself. Hope it's useful. Oh, that's nice. Oh, look at that. Cool.
1:31:49
All right. Seems pretty reasonable. Um, nice. So, I mean, hopefully you guys see here
1:31:55
with a little bit of work, something like this could go extraordinarily well. Um, what I'm going to do now is I'm going to go back here. Great work. I
1:32:03
want you to update the directive so that it works after scrape_leads.mmd.
1:32:10
I also want you to add this dossier as
1:32:16
an attachment column in the Google sheet URL that I provide
1:32:22
i.e. I should give you a Google sheet. Then you should create a new column called deep_ress research pitch. Then
1:32:30
you should generate this Google slide deck. And then you should paste the URL
1:32:36
in the representative row for whom you are generating the slide deck. Cool. And
1:32:42
on the right hand side here, looks like this is just tidying up.
1:32:47
Looks like we got outliers again, but we didn't get the transcript. So, I mean, this is like the second or third time
1:32:53
this is happening. I'm just going to have it use an appy scraper that I know can find the transcript. Um, so I'm just going to go over to Ampify, copy this
1:32:59
page in, and just give it to it. Okay, taking a look at this here. And yeah, looks like we've now added a column
1:33:05
called deep research pitch and also research date, which when you click that
1:33:11
through actually includes um the Google sheet here. So, you know, just as like a nugget of a system, uh, we built that
1:33:18
thing out in I don't know, maybe 15 minutes or so. Realistically, if I were to have tried building that with any sort of drag and drop development tool,
1:33:24
it would have taken me so much longer. And while this is certainly not the fleshed out thing that I would probably send people, um hopefully you guys could
1:33:30
see how we could very easily just modify this with some templating. We just say, "Hey, here's an actual template. Uh
1:33:36
here's an actual thing that we're actually sending people today to make money. Just copy it and then set up a
1:33:42
workflow that generates them using the deep research flow that we've done before." So, very simple, very
1:33:47
straightforward. And in this way, you can, you know, at least in this specific workflow example, um, generate cool deep
1:33:52
research dossier for everything and send people these, um, via email. Okay, this is hilarious, but I was just doing some
1:33:57
testing here on one of my cloud code instances, and it found a bunch of transcripts, and the transcripts were from Rick Ashley's video. So, I don't
1:34:04
know if it knew about Never going to give you up or if that was one of the outliers or if it's just screwing with
1:34:10
me, but that cracked me up. Okay, and we have the finished version of the YouTube outlier detector now. Um, looks like it
1:34:16
has detected a few videos here. How ALS could backfire on employers. Gemini 3.0 Procoder, AI bubble madness, so on and
1:34:23
so forth. We have video links here, associated view counts, the channels themselves, channel averages, and then
1:34:29
um the thumbnails too, which is pretty cool. I'm totally considering building in a workflow that like models these thumbnails, uses Nano Banana Pro to
1:34:35
generate them, and then just like swaps me in there instead. Like imagine Nick here instead of Jensen Hong. That would be freaking hilarious. Anyway, aside
1:34:42
from that, um, we've also generated some summaries. So, gives you like a hook, gives you some key takeaways, and then also gives you some information on
1:34:48
content ideas that maybe I could use on my own channel. So, I mean, like, you know, some of the stuff is tangentially useful. Obviously, it's not super mega
1:34:54
useful right now cuz I haven't spent too much time actually brushing it up, but just wanted to show you guys what was possible with a few minutes. Now, we've
1:35:00
built workflows, but why don't we go and use them? And this is the real power of self analing. Let me now show you how to
1:35:06
use these things, not necessarily just build them out for demo purposes. Okay, I've just gone through and I've reorganized my workspace a little bit.
1:35:12
We had a bunch of unnecessary output files and stuff like that. I've organized it into a tmp and then
1:35:18
directives execution. These other two are sort of like system level things that are required in order for, you
1:35:24
know, cloud code to run in this case. And this is a virtual environment for my Python scripts. I don't know any of that. That's just what the thing does in
1:35:30
the background. I've also added three configuration files so that I can use this in literally any ID. There's a
1:35:35
capitalized claude MD which is the same thing. And
1:35:41
then obviously I have the Gemini MD as well. Then I have all my API tokens in ENV. And then these are just temporary
1:35:46
things required for my OOTH. Now that I've done all of this great work, why don't we go and actually um work with
1:35:53
the directives just so I could show you guys how simple and straightforward they are. Let me open up Cloud Code first. And I'm just doing this in Cloud Code
1:35:59
because I can very easily duplicate this and open up as many instances of Cloud Code as I want. Okay, so what I've done here is I've set up VS Code and I've set
1:36:07
up three Cloud Code instances. One here is on the left, one here is up at the top, and then one here is down at the
1:36:12
bottom. Um, what I'm going to do is I'm just going to have two of these scrape leads. These will be over here on the right. And then I'm just going to do work and stuff like that sort of here um
1:36:19
on the left. So, I'll say scrape me 3,000.
1:36:25
Uh, I already used realtor. Why don't I do a campaign targeting SAS company
1:36:30
owners? The companies must be high ticket, i.e. charge over $250 a month on
1:36:38
average. And over here, I'm going to say scrape me, I don't know, 2,000. And then
1:36:44
instead of SAS company owners, we're going to do um let's see here, recruitment company decision makers in
1:36:52
the United States specifically. Uh let's do United States or Commonwealth countries. So, these two are now
1:36:58
working. I don't have to do anything uh in order for me to, you know, get any of that information. What I'm going to do next is I'm just going to go down to
1:37:04
directives. And while they're running, I'm just going to say I'm just doing my workday. Hey, I want um 10 YouTube
1:37:11
outliers about agentic workflows posted in the last week or so.
1:37:18
Compare them to my channel afterwards. Okay, cool. So, now I'm running three of these simultaneously. It's going to ask
1:37:25
me some questions up here. Looks like this one here didn't need any more information. I guess I was pretty vague up here, so that makes sense. Uh, we're
1:37:31
just going to go global. I know there's no built-in filter, but use your best
1:37:36
judgment. You can always retest and then access websites to find pricing
1:37:42
etc. Cool. All right, we're now opening up. I'm just going to do yes, don't ask
1:37:47
again. I'm getting very quick on the two key because it's doing a lot of that work for me. Looks like it's now running
1:37:52
the script over here to find the outliers over here. It is running my appy script. It's running into some
1:37:58
issues regarding global as a location, but that's good for us because the more issues that this thing runs into,
1:38:03
obviously, the more airtight our actual workflow becomes as it does and fixes things. So, so we see here it's even
1:38:09
using the correct formulation of the United States. So, it's going to start by targeting the US first for the SAS
1:38:14
and then it's going to do other options. So, looks like we've now generated some test results. It's doing so in this um
1:38:22
uh test_recruitment lead section. Now it's saying well above the 80% threshold, which is wonderful.
1:38:29
And now it's going to continue and run the entire scrape on 2,000 leads. This one over here is actually running
1:38:35
through each lead manually, and it's identifying whether or not this person is within our constraints. So, this is a
1:38:42
consulting company, not a SAS product company. So, I need to adjust my search terms. Now, it's going to go through, and it's actually going to like do this
1:38:48
loop over and over and over and over again, non-stop, until it finds what we want. So, I have my three little AI
1:38:53
employees chugging away. I'm just going to go grab another cup of tea.
1:39:02
Oh, I actually totally cheated there. I uh did a little bit of meal prep as well. But hey, what are we going to do? I got these AI workers doing stuff for
1:39:10
me. Doesn't really matter how long I take, right? Uh okay, so I found six videos about aentic workflows from the last week. That looks pretty cool.
1:39:17
Taking a peek at this. Uh some formulas are trying to send or receive data from external parties, right? Right. That's what happens when you try and load
1:39:22
images in Google. Unfortunately, not much we can do about it. I see first off my buddy Nate Herk is up at the top.
1:39:27
That's what I'm talking about, buddy. Keep on crushing it. We are going to
1:39:33
make this just a little bit smaller. And what do we got? We got a summary with a highle overview. Talking all about
1:39:38
Gemini 3 Pro. Fantastic. With the publish date as well, very recently. Got a couple of other people talking about things. Nice. I mean, obviously Gemini 3
1:39:45
Pro is pretty big. Wonder why I'm making a video on it today. with a lot of people talking about um AI
1:39:50
agents specifically by, you know, talking about how AI agents help overcome infrastructure complexity. Oh,
1:39:56
that's cool. Hm. PCIe attached acceleration card. No way. That's wild. And it's an example of like an actual agent, you know, doing a claims
1:40:02
processing thing. Hm. You know, lot lot that I could do there. Maybe I could make videos on that. This is on a voice agent, right, with Gemini 3 Pro. I mean,
1:40:09
I could see that as an opportunity. Yeah. Anyway, I guess what I'm trying to say is I'm trying to demonstrate that these flows can actually already be
1:40:15
pretty useful. I'm just as is. Okay. Okay, I'm just going to go and press one for all URLs that are fetching. Now,
1:40:20
what it's doing is it's actually running through the websites themselves to verify whether or not they are in the
1:40:25
target market that I want. And it's just going to continue doing this over and over and over again until it gets me the list that I'm looking for. Meanwhile,
1:40:32
bottom list looks pretty good. Theoretically, I mean, I could scrape like 30 of these simultaneously if I wanted to. I could have the agent, you
1:40:38
know, verify the results of one and then do another. I could have five different agents here simultaneously generating uh
1:40:44
copy and customizing them to send to other people. The possibilities here, at least for an outbound business like
1:40:49
myself, really are endless. But let's say, you know, I have some sort of, I don't know, proposal that I need to
1:40:55
generate or whatever, right? I haven't actually created any Python scripts or
1:41:00
directives that specifically generate proposals, right? Haven't done any of
1:41:05
that stuff yet. What I'm going to do is I'm going to go into my other workspace where I have these proposal generators
1:41:10
and I'm just going to copy over the directives and then the Python files into this one and then I'm going to run them. Let me show you what I mean.
1:41:16
First, I'm going to open another window. Then I'm going to open the folder that I was working at last week called
1:41:22
workspace. I'm going to head over here to directives in my old workspace. And if you guys remember, there was a create
1:41:28
proposal.md file. I'm just going to duplicate this and move the directive over here. This works the exact same way
1:41:33
as templating features in like make.com or NAD. It's just I'm literally sending over natural language. So the
1:41:39
probability of there being some issue here is a lot lower. Imagine if you could duplicate an NAD file and then copy and paste that into a make.com
1:41:46
environment. Would open up a ton of flexibility, right? Okay. So I believe
1:41:51
let me just check the directive itself for the create proposal. What did we use? If I just gopy h looks like it was
1:41:57
create_proposal.py. So I should be able to do everything I need just by copying pasting this over
1:42:03
here. And now I have this in my new workspace which is fantastic. So what I'm going to do here is I'm going to say
1:42:08
hey I'd like to generate a proposal. The company is called 1 second copy. Their main problem is they are currently
1:42:15
manually generating leads by assigning u virtual assistants from lower cost of
1:42:20
living countries to scrape various um lead databases and manually on LinkedIn.
1:42:26
They're currently spending somewhere between $5 to $10,000 a month on this. Our service uh costs equivalently for
1:42:33
the same number of leads that they're generating per month, which is $3,000 leads a month, less than $500. So large
1:42:39
cost savings there. But more importantly, it solves the opportunity cost of how many of their resources are
1:42:45
tied down uh into lead genen as opposed to things like setting, sales, uh
1:42:50
onboarding, and so on and so forth. Total cost of our service for this would be $12,000 in month 1, 8,500 in month
1:42:57
two, and 6,500 in month three. Create a proposal.
1:43:02
Okay, so no context on what any of these directives or executions are. What it's going to do though is it's immediately
1:43:08
going to read through all of these. After it finds the create proposal um in the execution level, it's then going to
1:43:15
search automatically for proposal. These two stars mean anything to the left and to the right of it in the directives
1:43:21
folder to find the according directive. So get that information and then it's just going to do a brief little double
1:43:27
check here as part of the directive. So what do I need from you? Client contact info, right? So Nick Sarif, we'll do
1:43:34
Nick@nicks.com. Turn this into four problems. Also company is 1 second copy. Cool. All
1:43:41
right. Now on the bottom here, it looks like we've actually already generated the list of 2,000 leads. That's pretty
1:43:47
cool. I'm just going to make this a little bit smaller so I can see them for myself. Looks like we have a lot of the
1:43:53
2,00 emails, which is huge. Okay, that's pretty cool. Uh, if I go back here to the top, what's what's going on here?
1:44:00
Looks like it's still doing the scrape. And what this actor did, because there's
1:44:06
significantly more difficulty in, you know, finding something as illdefined as high ticket SAS, right? Like it needs to
1:44:12
do a lot more work. It's actually attempting an approach where it runs four parallel scrapes across multiple
1:44:17
different regions to find a lead list. That's pretty wild. It also looks like it's gone through killed a bunch of
1:44:23
shells, created a filtering script with a 44% pass rate on test data. And its
1:44:29
goal is now it's going to get between 7 to 9,000 leads total with a 44% filter rate to give 3 to 4,000 quality SAS
1:44:36
leads, which meets our 3,000 target. Okay, so since I've set this to auto run, it's automatically running. Here
1:44:42
it's going. And it's also running like its own little sleep script. So every 120 seconds it just checks back in. This
1:44:47
agent is asking me if everything here looks accurate, if it can go ahead and proceed with creating the proposal. I don't really like that it's asking me
1:44:53
that question. So I'm just going to say update directive to preclude asking me
1:44:59
for permission. Instead just run just assume I want you yes we can generate
1:45:06
this to generate. Okay. So it's need to find a pandock. Ah yes that's something that I'm missing for sure. So, I'm just
1:45:12
going to head back to my other workspace and add that in. Let me tell it updated. It's now good to go. Cool.
1:45:19
It's now going to go and create, which is nice. Meanwhile, you know, we've done a fair
1:45:24
amount of work here with these recruitment companies, but I want to go a little bit further. I mean, why is there an agent just sitting around not
1:45:29
doing anything productive, right? Why should I allow that to occur? What I'm going to do instead is I'm going to head over here to the directives and I'm also
1:45:37
going to duplicate the let's see the casualize company names and then the
1:45:42
casualized company names batch endpoint here too. I'm then going to paste this in. I'm realizing here that I can't
1:45:49
paste both these into the same folder. I'm going to head down here and I'll say great work. Now casualize these company
1:45:55
names. As you guys can see, when you use something like claw code for this, um the constant permission asking is kind
1:46:01
of a pain in the ass, right? Ideally, you would have all this stuff occur totally autonomously with absolutely no
1:46:06
permissions or anything like that. That said, you know, as you scale up and you start organizing and and working and
1:46:11
orchestrating more of these agents working simultaneously, um you do need some sort of check and balance to make
1:46:17
sure that it's not doing things that, you know, you don't want to do. Okay, I'm now going to see if we could send an email. That's pretty cool. It's then
1:46:23
going to send me some notifications. I should note there's no execution script for um the directive. So ideally we'd
1:46:29
have an MCP that would do that. So what I can do is I can actually go back into Claude and I can get my MCP.json.
1:46:35
So I'm going to copy this over head and over here to Claude. I'll paste this in. Okay. And I'm taking a look at this
1:46:41
proposal now. Let's see how good of a job it did. Nice. Good job little AI worker. So we
1:46:48
scroll down here. We see you're spending between 5 to 10,000 per month on virtual assistants to manually scrape lead databases in LinkedIn. your team's time
1:46:54
and attention is being consumed. Manual lead scraping introduces human error and your current system requires hiring more VAS. As you can see here, there's
1:47:01
there's there's one thing to build these systems and it's another thing entirely to use these systems. And so what I'm
1:47:07
doing here is I'm showing you that you can build very effective systems in a very small period of time. And then this
1:47:13
isn't all just academic. It's not theoretic. What you can do is you can actually just start using these things on your own in your own workspace super
1:47:20
easily. So, I have these u three agents doing the equivalent of several hours of work for me in literally just a couple
1:47:26
of minutes. Okay. And then finally, I see it's asking me to set up a Gmail sending the script/mcp server and then
1:47:32
copy the HTML content send manually. I'm actually just going to have it do it automatically. If you guys didn't know, um you can set up MCPS uh pretty easily
1:47:39
here. What I'm going to do is I'm just going to have it reference that MCP.json. The way that I do this is I'm going to go new conversation. I'm going
1:47:45
to check MCP status. Okay. Okay. And while I'm at it, I see that we've now assembled a list of 3,000 highquality or
1:47:52
high ticket SAS owners. This is pretty cool. Really excited to see how high quality these leads are for a campaign
1:47:57
that I'm running. Let's just make it so we can see all of these rows. That's pretty cool. Of the 3,000, we got 2,970
1:48:03
emails, which is just pretty wild. Um, I'm also going to ask it to casualize company names.
1:48:09
So that way we get a oneline casual company name. And I'm just going to check the performance of the other one here. Moving all the way to the right.
1:48:14
Looks like it took uh the word, you know, American recruiters, turned them
1:48:20
into American recruiters. That makes sense. This was Patrice and Associates. This is
1:48:26
Tallahassee recruiters. This is Minesite recruiters turned to Minesite. Yeah, that this all looks pretty good to me.
1:48:32
Um I mean, you know, we only found the ones or we only casualized the ones that actually had email addresses. So, we didn't casualize all of them, but we
1:48:38
casualized most. Pretty solid. Um, now I'm just going to set up an MCP so that we could do the email which is part of
1:48:44
the directive that I didn't move over previously. Okay. And then I also sent a little email summary of the proposals.
1:48:49
So, thanks for discussing your lead generation challenges. Wanted to break down what you discussed into a clear implementation plan. Sending you a full proposal for the above shortly. Let me
1:48:55
know if you have any questions or want to discuss further. Um, got the structure over here. I mean, I just wrote this really quickly so that you
1:49:00
guys could see what this looks like as an example. I'd probably take out the steps. It looks kind of weird. I also don't like how it's bolded. But yeah, uh
1:49:07
in a nutshell, you know, you can use this thing as your operating system. You can use this as your entire business OS.
1:49:13
You don't necessarily need to even really use like a graphical user interface for anything anymore cuz you
1:49:18
can just tell it what you want it to do. And the context is long enough that you could, you know, use this as your proposal generator, use this as your, I
1:49:26
don't know, transcript thing, use this as your like review tool for sales calls. You could use this for all of
1:49:31
your fulfillment obviously by designing uh extemporaneous automations in an executions folder. You could use this
1:49:37
for all of your own company SOPs by storing them in directives up here. I mean you could use this thing for basically anything. And I'm sure
1:49:43
graphical user interfaces will come up. This is still very much like DOSS style back in you know like the 70s ' 80s and
1:49:48
'90s. Um at least for what I believe will be the future of communicating with these interfaces. But yeah, pretty
1:49:54
powerful already. Okay. So, I'm going to give you guys all uh what you need in order to have this self-annealing
1:49:59
agentic workflow generator and operator. Um, all you really need, as I've shown you guys before, is some sort of like
1:50:05
initialization file, like an agent.md, cloud MD, or a Gemini MD. Want to make sure you guys have that. And then from
1:50:11
here on out, all you need to do is just open up your uh own workspace in the ID of your choice, initialize with that,
1:50:17
ask it to actually create the project structure for you, and then do whatever the heck you want. Man, it's a free world. And just like that, you guys are
1:50:23
now set up. You have your directives folder for your SOPs. You have your execution folder for your tools. You have your system prompt configured to
1:50:29
enforce that DO framework and then enable self-annealing as well. And you probably even now have a couple of basic workflows. To make a long story short,
Outro
1:50:35
your environment is ready. And hopefully this AI employee is now hired and sitting at their desk. We've covered a
1:50:40
ton of ground today and I just want to take a moment to thank you for being with me. Before we end, let's recap to really instill these concepts in your
1:50:46
brain. So, we started with a few examples of realistent workflows I use in my business including lead scraping and then proposal generating. We then
1:50:52
discussed the main problem with agents up until now which is basically the stochastic or flexible nature of LLMs
1:50:58
and why that means they typically fail in higherend business applications. After that we introduced the solution
1:51:03
which was the DO framework which separates directives orchestration and execution to bring a lot more
1:51:09
reliability into actual agentic workflows. Then we learned about self annealing which is this concept where you give your agents the ability to
1:51:15
learn from their mistakes and then rewrite their own tools to get stronger over time. And then finally I showed you guys how to practically set up a
1:51:20
development environment. In this case, it was anti-gravity to host these agents for you. So, what you have now is not just a collection of scripts. You have
1:51:26
everything you need in order to build a very high ROI agent business operating system. Basically, you have the tools to
1:51:31
take any repetitive high-v value task in a digital business, whether it's lead genen or proposal writing, customer
1:51:36
support, data analysis, literally whatever the heck you want, and then turn it into an autonomous self-improving workflow. So, yeah, this
1:51:42
is the future of work. It is not coming. It is already here. The only thing left to do is actually build it and then distribute it. And if we're smart about
1:51:48
how we do so, you and I can actually meaningfully influence the economy, which was my whole idea behind making this free course. If you guys like this
1:51:54
sort of thing and you want to build a workflows professionally and maybe even get paid for it, do check out Maker School. It's my 90-day accountability
1:52:00
roadmap to take you from zero to your very first paying customer for an AI related service. I also guarantee results. So, if you don't land your
1:52:05
first customer in that time, you do get the money you spent on my program back. Otherwise, have a lovely rest of the day and I'm looking forward to seeing what
1:52:11
you guys build. Cheers.
