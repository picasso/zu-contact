// eslint-disable-next-line no-undef
const marked = require('marked');
// eslint-disable-next-line no-undef
const fs = require('fs');

const debugTokens = false;

// Conversion options ---------------------------------------------------------]

const options = {
    contributors: 'dmitryrudakov',
    tags: 'gutenberg, ajax, contact form, feedback, email, feedback form, contact',
    tested: '5.7',
    license: 'GPLv2 or later',

    pluginfile: 'zu-contact.php',
    fromfile: 'README.md',
    tofile: 'readme.txt',
    logfile: 'CHANGES.md',
    limitRecordrs: 15,
};

// Skip tokens
const skipTokens = [
    // if 'contains' is true then skip all tokens of this 'type'
    { type:'html', contains: true },
    { type:'blockquote', contains: '&#x1F383;' },
    { type:'blockquote', contains: '&#x2757;' },
    { type:'paragraph', contains: 'img.shields.io' },
    { type:'paragraph', contains: 'user-images.githubusercontent.com' },
    { type:'paragraph', contains: 'ps.w.org' },
    // custom tokens
    { type:'paragraph', contains: 'Unfortunately WordPress does not come' },
    // { type:'heading', contains: 'Download' },
    // { type:'list', contains: 'archive/master.zip' },
    // { type:'list', contains: 'downloads.wordpress.org' },
];

// Skip sections
const skipSections = [
    'Download',
    'Extensions',
    'Support',
];

// Skip log record if it ends with these strings
const skipLogs = [
    '(-)',
    '[-]',
];

// Processing Сore ------------------------------------------------------------]

function readFileAndSaveResult() {

    const buffer = fs.readFileSync(options.fromfile);
    const readme = parseReadme(buffer.toString());

    const buffer2 = fs.readFileSync(options.logfile);
    const log = parseChangelog(buffer2.toString(), options.limitRecordrs);

    const result = String(readme + '\n\n== Changelog ==\n\n' + log).replace(/\n{3,}/g, '\n\n');
    fs.writeFileSync(options.tofile, result);
}

function parseReadme(md) {

    const tokens = marked.lexer(md);
    // debug('Tokens:', tokens); // more compact because without logging each array item
    // debug({ context: 'Tokens:'}, tokens);
    // debug({ context: 'List tokens:', type: 'list', deep: true}, tokens);
    // debug({ context: 'List tokens:', type: 'list', contains: 'With custom'}, tokens);
    // debug({ context: 'Headings 2:', type: 'heading', depth: 2, deep: true }, tokens);
    // debug({ context: 'Paragraph:', type: 'paragraph'}, tokens);

    let content = [];
    let skipSection = { enabled: false, depth: 0 };
    let screenshots = 0;

    tokens.forEach(token => {

        // skip single tokens
        const shouldSkip = skipTokens.reduce((acc, value) => {
            if(acc === true || value === undefined) return acc;
            if(token.type === value.type &&
                (value.contains === true || token.raw.includes(value.contains))
            ) return true;
            else return false;
        }, false);

        // skip whole sections
        if(token.type === 'heading') {
            if(skipSection.enabled) {
                if(token.depth <= skipSection.depth) skipSection.enabled = false;
            }
            if(!skipSection.enabled) {
                skipSections.forEach(heading => {
                    if(token.raw.includes(heading)) {
                        skipSection.enabled = true;
                        skipSection.depth = token.depth;
                    }
                });
            }
        }

        if(shouldSkip || skipSection.enabled) return debugToken(token, true);

        if(token.type === 'heading') {
            // main heading
            if(token.depth === 1) {
                const heading = token.text.split(':')[0] || token.text;
                content.push(`=== ${heading.trim()} ===${parseHeader(options)}\n\n`);
                return debugToken(token);
            }
            // regular headings & screenshots
            if(token.depth === 2) {
                if(token.raw.includes('[![')) {
                    let screenshotName = null;
                    try {
                      screenshotName = token.tokens[0].tokens[0].text;
                    } catch(e) { /* ignore the error */ }

                    if(screenshotName) content.push(`${++screenshots}. ${screenshotName}\n`);
                } else {
                    content.push(`== ${token.text} ==\n\n`);
                }
                return debugToken(token);
            }
        }
        // remove all HTML comments
        let cleanRaw = token.raw.replace( /<!--.*?-->\n?/gm, '');
        // add newline after 'paragraph'
        if(token.type === 'paragraph') cleanRaw = `${cleanRaw}\n`;
        // remove one newline because was already added to 'paragraph'
        if(token.type === 'space') cleanRaw = cleanRaw.replace(/\n{1}/m, '');
        content.push(cleanRaw);
        debugToken(token);
    });
    return content.join('');
}

function parseChangelog(md, limit) {

    const tokens = marked.lexer(md);
    // debug('Changelog Tokens:', tokens);
    let content = [];
    let count = 0;

    tokens.forEach(token => {
        if(count > limit) return;

        if(token.type === 'heading') {
            if(token.depth === 4) {
                const heading = token.text.split('/')[0] || token.text;
                content.push(`\n### ${heading.trim()} ###\n`);
                return;
            }
        }

        if(token.type === 'list') {
            token.items.forEach(item => {
                // skip single log record
                const shouldSkip = skipLogs.reduce((acc, value) => {
                    if(acc === true || value === undefined) return acc;
                    if(item.text.endsWith(value)) return true;
                    else return false;
                }, false);

                if(shouldSkip) return;
                else content.push(item.raw);
            });
            count++;
        }
    });
    return content.join('');
}

function parseHeader(data) {

    const buffer = fs.readFileSync(data.pluginfile);
    const string = buffer.toString();

    const version = /Version\s*:\s*([^\s]+)/gm.exec(string);
    data.stable = version !== null ? version[1] : '1.0.0';

    const requires = /Requires at least\s*:\s*([^\s]+)/gm.exec(string);
    data.requires = requires !== null ? requires[1] : '5.1';

    const php = /Requires PHP\s*:\s*([^\s]+)/gm.exec(string);
    data.php = php !== null ? php[1] : '7.0';

    return `
Contributors: ${data.contributors}
Tags: ${data.tags}
Requires at least: ${data.requires}
Tested up to: ${data.tested}
Stable tag: ${data.stable}
License: ${data.license}
Requires PHP: ${data.php}`;
}

// Debug functions ------------------------------------------------------------]

function isString(value) {
    return typeof value === 'string' || value instanceof String;
}

function debugToken(token, shouldSkip = false) {
    if(debugTokens) {
        let outputToken = { type: token.type, raw: token.raw };
        if(token.depth) outputToken.depth = token.depth;
        if(token.text) outputToken.text = token.text;
        debug(`* ${token.type.toUpperCase()}:${shouldSkip ? ' SKIPPED!' : ''}`, outputToken);
    }
}

function debug(params, value) {
    const simpleOutput = isString(params);
    const { context, type, depth, deep, contains } = simpleOutput ? { context: params } : params;
    const deepOutput = (token, p) => {
        const level = `${p} > ${token.type.toUpperCase()}`;
        console.log(level);
        console.log(token);
        if(Array.isArray(token.tokens)) {
            token.tokens.forEach(t => deepOutput(t, level));
        }
        else if(Array.isArray(token.items)) {
            token.items.forEach(t => deepOutput(t, level));
        }
    };
    const output = val => {
        const allowed = contains ? val.raw.includes(contains) : true;
        const allowedType = type === undefined ? val.type : type;
        const allowedDepth = depth === undefined ? val.depth : depth;
        if(allowed && val.type === allowedType && val.depth === allowedDepth) {
            console.log(val);
            if(deep === true) {
                const collection = Array.isArray(val.tokens) ? val.tokens : (
                                    Array.isArray(val.items) ? val.items : null
                );
                if(collection) {
                    const level = val.type.toUpperCase();
                    console.log(`>>>>>>>>>> (${level})`);
                    collection.forEach(t => deepOutput(t, level));
                    console.log(`<<<<<<<<<< (${level})\n`);
                }
            }
        }
    };
    if(simpleOutput) console.log(context, value, '\n');
    else {
        console.log(`\n\n### ${context} ###\n`);
        if(Array.isArray(value)) {
            value.forEach(output);
        } else {
            output(value);
        }
    }
}

// Start! ---------------------------------------------------------------------]

// read file & process it
readFileAndSaveResult();
